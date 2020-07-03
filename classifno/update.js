const Log = require('../utils/debug.js');

/**
 * 학급 정보 수정
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function updateClassinfo(req, res, connection)  {

    let sql = `
    UPDATE CLASS_INFO 
      SET  `;
      
    if(!!req.body.className)     { sql += '\n' + `CLASS_NAME = '${req.body.className}',`; }
    if(!!req.body.semesterId)    { sql += '\n' + `SEMESTER_ID = ${req.body.semesterId},`; }
    if(!!req.body.classroomId)   { sql += '\n' + `CLASSROOM_ID = ${req.body.classroomId},`; }
    if(!!req.body.department)    { sql += '\n' + `DEPARTMENT = ${req.body.department},`; }
    if(!!req.body.grade)         { sql += '\n' + `GRADE = ${req.body.grade},`; }
    if(!!req.body.classNo)       { sql += '\n' + `CLASS_NO = ${req.body.classNo},`; }
    if(!!req.body.classTime)     { sql += '\n' + `CLASS_TIME = '${req.body.classTime}',`; }
    if(!!req.body.classType)     { sql += '\n' + `CLASS_TYPE = '${req.body.classType}',`; }
    if(!!req.body.teacherId)     { sql += '\n' + `TEACHER_ID = ${req.body.teacherId},`; }
    if(!!req.body.classCapacity) { sql += '\n' + `CLASS_CAPACITY = ${req.body.classCapacity},`; }
    if(!!req.body.schoolfeeType) { sql += '\n' + `SCHOOLFEE_TYPE = '${req.body.schoolfeeType}',`; }
    
    sql += `UDT_DTM = NOW(),
            UDT_ID = '${req.body.udtId}'
     WHERE CLASS_ID = ${req.body.classId}
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classinfo/update called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classinfo/update called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//updateClassinfo

/**
 * 폐강
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function cancelClassinfo(req, res, connection)  {

    let sql = '';

    //2단계 - CLASSINFO_STUDENTS 삭제 - 해당 학급에 배정된 학생들을 삭제한다.
    sql += `
    DELETE FROM CLASSINFO_STUDENTS
    WHERE CLASS_ID = ${req.body.classId} ;
    `;
    
    //6단계 - 
    sql += `
    UPDATE CLASS_INFO
       SET CLASS_STATUS = 'CANCEL',
           USE_YN = 'N',
           CANCEL_REASON = '${req.body.cancelReason}',
           UDT_ID = '${req.body.udtId}',
           UDT_DTM = NOW()
     WHERE CLASS_ID = ${req.body.classId};
     `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classinfo/cancel called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classinfo/cancel called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//cancelClassinfo

/**
 * 종강
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function endClassinfo(req, res, connection)  {

    let sql = `
    UPDATE CLASS_INFO
       SET CLASS_STATUS = 'END',
           UDT_ID = '${req.body.udtId}',
           UDT_DTM = NOW()
     WHERE CLASS_ID = ${req.body.classId} ;
     `;

     /**
      * 종강 할때 종료일자와 수강중단사유가 NULL 인 경우의 학생들은 정상적으로 종료 된다고 생각한다.
      */
    sql += `
    UPDATE CLASSINFO_STUDENTS
    SET END_DATE = '${req.body.endDate}',
        COMPLETE_YN = 'Y',
        UDT_ID = '${req.body.udtId}',
        UDT_DTM = NOW()
    WHERE CLASS_ID = ${req.body.classId} 
     AND END_DATE IS NULL
     AND ABANDON_REASON IS NULL ;
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`end called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`end called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//endClassinfo

/**
 * 학급 운영확정
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function determineClassinfo(req, res, connection)  {

    let sql = '';

     //1단계 학생별 학습이력 입력
     sql += `
     INSERT INTO STUDENT_CLASS_HISTORY (
        CLASS_ID,
        STUDENT_ID,
        CLASS_HISTORY_SEQ,
        CRE_ID,
        CRE_DTM
    )
        SELECT A.CLASS_ID,
               B.STUDENT_ID,
               0,
               '${req.body.udtId}',
               NOW()
        FROM CLASS_INFO A
        INNER JOIN CLASSINFO_STUDENTS B
        ON A.CLASS_ID = B.CLASS_ID
        WHERE A.CLASS_ID = ${req.body.classId};
    `;

    //2단계 - 학급정보 운영으로 변경 
    sql += `
    UPDATE CLASS_INFO
       SET CLASS_STATUS = 'OPERATING',
           UDT_ID = '${req.body.udtId}',
           UDT_DTM = NOW()
     WHERE CLASS_ID = ${req.body.classId};
     `;

    //3단계
    sql += `
    UPDATE STUDENT_BASIC_INFO
       SET UDT_DTM = NOW(), 
           UDT_ID = '${req.body.udtId}',
    `;

    if(req.body.classType === 'R'){
        //정규수업
        sql += `LAST_CLASS_ID = ${req.body.classId} `
    }else if(req.body.classType === 'E'){
        //특별활동
        sql += `LAST_EXTRA_ID = ${req.body.classId} `
    }
    
    sql += `       
     WHERE 1=1
       AND STUDENT_ID IN (SELECT B.STUDENT_ID
                            FROM CLASS_INFO A
                           INNER JOIN CLASSINFO_STUDENTS B
                              ON A.CLASS_ID = B.CLASS_ID
                           WHERE A.CLASS_ID = ${req.body.classId} );       
   `; 

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classinfo/determine called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classinfo/determine called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//determineClassinfo

module.exports = {
    updateClassinfo,
    cancelClassinfo,
    determineClassinfo,
    endClassinfo    //종강
}
