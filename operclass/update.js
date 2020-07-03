const Log = require('../utils/debug.js');

/**
 * 학급별 학생정보 중 수료여부, 감면사유 수정
 */
updateStudent = (req, res, connection) => { 

    let sql = `
    UPDATE CLASSINFO_STUDENTS 
       SET UDT_ID =     '${req.body.udpId}' ,
           UDT_DTM =     NOW(),  
    `
    if(!!req.body.completeYn) { sql += ` COMPLETE_YN = '${req.body.completeYn}' `; }
    if(!!req.body.reduction) { sql += ` REDUCTION_TYPE = '${req.body.reduction}' `; }

    sql +=  `   
     WHERE CLASS_ID =   ${req.body.classId}
       AND STUDENT_ID = ${req.body.studentId}
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/operclass/student/update failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/operclass/student/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
};//updateStudent

/**
 * 휴학처리
 */
leaveStudent = (req, res, connection) => { 

    //학생이력 저장
    let sql = `
    INSERT INTO STUDENT_HISTORY (
        STUDENT_ID,
        HISTORY_SEQ,
        STUDENT_STATUS,
        LEAVE_ABSENSE,
        INPUT_DATE,
        CRE_ID,
        CRE_DTM
    ) 
    SELECT STUDENT_ID,
           MAX(HISTORY_SEQ) + 1 ,
           'LEV',
           '${req.body.leaveAbsense}',
           '${req.body.inputDate}',
           '${req.body.udtId}' ,
           NOW() 
      FROM STUDENT_HISTORY
     WHERE STUDENT_ID = ${req.body.studentId} ;
    `;
    
    //학생기본정보 수정
    //STUDENT_STATUS 학생상태
    //LEAVE_ABSENSE 휴학사유
    sql += `       
    UPDATE STUDENT_BASIC_INFO
    SET UDT_ID = '${req.body.udtId}' ,
        UDT_DTM = NOW(), 
        LAST_HISTORY_SEQ = (SELECT MAX(HISTORY_SEQ)
                             FROM STUDENT_HISTORY
                             WHERE STUDENT_ID = ${req.body.studentId} )
    WHERE STUDENT_ID = ${req.body.studentId} ;
    `;

    /**
     * 휴학 처리할 때
     * 모든 수강 중인 학급은 수강중단 처리되며 수강종료일은 휴학신청일, 수강중단사유는 휴학이 된다.
     */
    sql += `
        UPDATE CLASSINFO_STUDENTS
        SET COMPLETE_YN = 'N', 
            END_DATE = '${req.body.inputDate}', #수강종료일-휴학신청일
            ABANDON_REASON = 'LEAVE', #수강중단사유-휴학
            UDT_ID = '${req.body.udtId}' ,
            UDT_DTM = NOW()
        WHERE STUDENT_ID = ${req.body.studentId}
          AND END_DATE IS NULL ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`'/api/operclass/student/leave/update failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`'/api/operclass/student/leave/update called sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
};//leaveStudent

/**
 * 다른반으로 이동
 */
tradeStudent = (req, res, connection) => { 
    
    //이전 학급 미수료 처리, 수강종료일, 중간사유 저장
    let sql = `
     UPDATE CLASSINFO_STUDENTS
     SET UDT_ID = '${req.body.udtId}' ,
         UDT_DTM = NOW(),
         COMPLETE_YN = 'N',
         END_DATE = '${req.body.endDate}',
         ABANDON_REASON = 'MOVE' #수강중단사유-다른반으로이동
     WHERE CLASS_ID =   ${req.body.oldClassId}
       AND STUDENT_ID = ${req.body.studentId} ;
    `;

    //신규 학급 입력
    sql += `
    INSERT INTO CLASSINFO_STUDENTS ( 
        CLASS_ID,
        STUDENT_ID,
        CRE_ID,
        CRE_DTM,
        USE_YN,
        COMPLETE_YN,
        REDUCTION_TYPE,
        START_DATE
    ) VALUES (
        ${req.body.newClassId},
        ${req.body.studentId},
        '${req.body.udtId}',
        NOW(),
        'Y',
        'N',   #수료여부-미수료
        'NA',  #수업료감면사유-해당없음
        '${req.body.startDate}'
    )  ;
    `;

    //학생기본정보 수정
    //STUDENT_STATUS 학생상태
    //LEAVE_ABSENSE 휴학사유
    sql += `       
    UPDATE STUDENT_BASIC_INFO
    SET UDT_ID =  '${req.body.udtId}' ,
        UDT_DTM =  NOW(), 
    `;

    if(req.body.classType === 'R'){
        //정규수업
        sql += `LAST_CLASS_ID = ${req.body.newClassId} `
    }else if(req.body.classType === 'E'){
        //특별활동
        sql += `LAST_EXTRA_ID = ${req.body.newClassId} `
    }
    
    sql += ` 
     WHERE STUDENT_ID = ${req.body.studentId} ;
    `;
    
    sql += `
    INSERT INTO STUDENT_CLASS_HISTORY (
        CLASS_ID,
        STUDENT_ID,
        CLASS_HISTORY_SEQ,
        CRE_ID,
        CRE_DTM
    )
    SELECT ${req.body.newClassId},
           ${req.body.studentId},
           CASE WHEN CLASS_HISTORY_SEQ IS NULL THEN 0 ELSE MAX(CLASS_HISTORY_SEQ)+1 END,
           '${req.body.udtId}',
           NOW()
    FROM STUDENT_CLASS_HISTORY
    WHERE CLASS_ID = ${req.body.newClassId}
    AND STUDENT_ID = ${req.body.studentId} ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/operclass/student/trade/update failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/operclass/student/trade/update called sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
};//tradeStudent

/**
 * 학생 전입
 */
insertStudent = (req, res, connection) => { 

    Log.print('/api/operclass/student/register/update called ');
    
    //이전 학급 삭제
    let sql =  `
    INSERT INTO  CLASSINFO_STUDENTS ( 
        CLASS_ID,
        STUDENT_ID,
        CRE_ID,
        CRE_DTM,
        USE_YN,
        COMPLETE_YN,
        REDUCTION_TYPE,
        START_DATE
    ) VALUES (
        ${req.body.classId},
        ${req.body.studentId},
        '${req.body.creId}',
        NOW(),
        'Y',
        'N',  #수료여부-미수료
        'NA',  #수업료 감면사유-해당없음
        '${req.body.startDate}'
    )  ;
    `;
    
    sql += `
    INSERT INTO STUDENT_CLASS_HISTORY (
        CLASS_ID,
        STUDENT_ID,
        CLASS_HISTORY_SEQ,
        CRE_ID,
        CRE_DTM
    )
        SELECT ${req.body.classId},
               ${req.body.studentId},
               CASE WHEN CLASS_HISTORY_SEQ IS NULL THEN 0 ELSE MAX(CLASS_HISTORY_SEQ)+1 END,
               '${req.body.creId}',
               NOW()
        FROM STUDENT_CLASS_HISTORY
        WHERE CLASS_ID = ${req.body.classId}
         AND STUDENT_ID = ${req.body.studentId} ;
    `;

    //학생기본정보 수정
    //STUDENT_STATUS 학생상태
    //LEAVE_ABSENSE 휴학사유
    sql += `       
    UPDATE STUDENT_BASIC_INFO
    SET UDT_ID =  '${req.body.creId}' ,
        UDT_DTM =  NOW(),         
    `;

    if(req.body.classType === 'R'){
        //정규수업
        sql += ` LAST_CLASS_ID = ${req.body.classId} `
    }else if(req.body.classType === 'E'){
        //특별활동
        sql += ` LAST_EXTRA_ID = ${req.body.classId} `
    }
    
    sql += ` 
     WHERE STUDENT_ID = ${req.body.studentId} ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/operclass/student/register/update failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/operclass/student/register/update called sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
};//insertStudent

/**
 * 복학
 */
returnStudent = (req, res, connection) => { 

    Log.print('/api/operclass/return/update called ');

    //학생이력 저장
    let sql = `
    INSERT INTO STUDENT_HISTORY (
        STUDENT_ID,
        HISTORY_SEQ,
        STUDENT_STATUS,
        LEAVE_ABSENSE,
        INPUT_DATE,
        CRE_ID,
        CRE_DTM
    ) 
    SELECT STUDENT_ID,
           MAX(HISTORY_SEQ) + 1 ,
           '${req.body.studentStatus}',
           '',
           '${req.body.inputDate}',
           '${req.body.udtId}' ,
           NOW() 
      FROM STUDENT_HISTORY
     WHERE STUDENT_ID = ${req.body.studentId} ;
    `;
    
    //학생기본정보 수정
    //STUDENT_STATUS 학생상태
    //LEAVE_ABSENSE 휴학사유
    sql += `       
    UPDATE STUDENT_BASIC_INFO
    SET UDT_ID = '${req.body.udtId}' ,
        UDT_DTM = NOW(), 
        LAST_HISTORY_SEQ = (SELECT MAX(HISTORY_SEQ)
                             FROM STUDENT_HISTORY
                             WHERE STUDENT_ID = ${req.body.studentId} )
    WHERE STUDENT_ID = ${req.body.studentId} ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/operclass/return/update failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/operclass/return/update called sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
};//returnStudent

/**
 * 수강중단
 */
abandonClass = (req, res, connection) => { 
    let sql = `
        UPDATE CLASSINFO_STUDENTS
        SET COMPLETE_YN = 'N', 
            END_DATE = '${req.body.endDate}', #수강종료일-휴학신청일
            ABANDON_REASON = '${req.body.abandonReason}', #수강중단사유
            UDT_ID = '${req.body.udtId}' ,
            UDT_DTM = NOW()
        WHERE  CLASS_ID =   ${req.body.classId}
        AND STUDENT_ID = ${req.body.studentId} ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/operclass/student/abandon/update failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/operclass/student/abandon/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}//abandonClass

/**
 * 졸업
 */
graduateStudent = (req, res, connection) => { 

    //학생이력 저장
    let sql = `
    INSERT INTO STUDENT_HISTORY (
        STUDENT_ID,
        HISTORY_SEQ,
        STUDENT_STATUS,
        LEAVE_ABSENSE,
        INPUT_DATE,
        CRE_ID,
        CRE_DTM
    ) 
    SELECT STUDENT_ID,
           MAX(HISTORY_SEQ) + 1 ,
           '${req.body.studentStatus}',
           '',
           '${req.body.inputDate}',
           '${req.body.udtId}' ,
           NOW() 
      FROM STUDENT_HISTORY
     WHERE STUDENT_ID = ${req.body.studentId} ;
    `;
    
    //학생기본정보 수정
    sql += `       
    UPDATE STUDENT_BASIC_INFO
    SET UDT_ID = '${req.body.udtId}' ,
        UDT_DTM = NOW(), 
        GRADUATE_DAY = '${req.body.inputDate}',
        LAST_HISTORY_SEQ = (SELECT MAX(HISTORY_SEQ)
                             FROM STUDENT_HISTORY
                             WHERE STUDENT_ID = ${req.body.studentId} )
    WHERE STUDENT_ID = ${req.body.studentId} ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/operclass/graduate/update failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/operclass/graduate/update called sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
};//graduateStudent

module.exports = {
    updateStudent,
    leaveStudent,
    returnStudent, //복학
    graduateStudent, //졸업
    tradeStudent, //다른 반으로 이동
    insertStudent,   //전입
    abandonClass    //수강중단
}
