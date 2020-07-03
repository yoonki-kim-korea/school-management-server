const Log = require('../utils/debug.js');

/**
 * 학급 정보 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveClassinfo(req, res, connection)  {

    let sql = `
    INSERT INTO CLASS_INFO (
        CLASS_ID,
        CLASS_NAME,
        SEMESTER_ID,
        CLASSROOM_ID,
        DEPARTMENT,
        GRADE,
        CLASS_NO,
        CLASS_TIME,
        CLASS_TYPE,
        TEACHER_ID,
        CLASS_CAPACITY,
        CLASS_STATUS,
        SCHOOLFEE_TYPE,
        USE_YN,
        CRE_ID,
        CRE_DTM
    ) SELECT CASE WHEN CLASS_ID IS NULL THEN 0 ELSE MAX(CLASS_ID)+1 END,
             '${req.body.className}' ,
             '${req.body.semesterId}' ,
             '${req.body.classroomId}' ,
             '${req.body.department}' ,
             '${req.body.grade}' ,
             '${req.body.classNo}' ,
             '${req.body.classTime}' ,
             '${req.body.classType}' ,
             '${req.body.teacherId}' ,
              ${req.body.classCapacity} ,
             '${req.body.classStatus}' ,
             '${req.body.schoolfeeType}' ,
             'Y' ,
            '${req.body.creId}' ,
             NOW()
       FROM CLASS_INFO ;
`;

sql += `
    INSERT INTO TEACHER_HISTORY ( 
           TEACHER_ID, 
           CLASS_ID,
           CRE_ID,
           CRE_DTM
    ) SELECT MAX(CLASS_ID),
             '${req.body.teacherId}' ,
             '${req.body.creId}' ,
             NOW()
        FROM CLASS_INFO ;
`;

sql +=`
    INSERT INTO CLASSROOM_HISTORY ( 
        CLASSROOM_ID, 
        CLASS_ID,
        CRE_ID,
        CRE_DTM
    ) SELECT MAX(CLASS_ID),
            '${req.body.classroomId}' ,
            '${req.body.creId}' ,
            NOW()
        FROM CLASS_INFO ;
`;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classinfo/save called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classinfo/save called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//saveClassinfo

/**
 * 학생배정 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveAssigned(req, res, connection)  {
    let sql = '';

    //1단계 - CLASSINFO_STUDENTS 삭제 - 해당 학급에 배정된 학생들을 삭제한다.
    sql += `
    DELETE FROM CLASSINFO_STUDENTS
    WHERE CLASS_ID = ${req.body.classId} ;
    `

    //2단계 - CLASSINFO_STUDENTS 저장 - 새로은 학생목록을 학급에 저장한다.
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
    ) 
    SELECT ${req.body.classId} ,
           STUDENT_ID ,
           '${req.body.creId}' ,
           NOW(),
           'Y',
           'N',  #수료여부-미수료
           'NA',  #수업료감면사유-해당없음
           '${req.body.startDate}' #수강시작일
      FROM STUDENT_BASIC_INFO
    WHERE STUDENT_ID IN (${req.body.student_ids}) ;    
    `;

    //3단계 - 
    sql += `
    UPDATE CLASS_INFO
       SET CLASS_STATUS = (SELECT CASE WHEN COUNT(STUDENT_ID) > 0 THEN 'ASSIGN' ELSE 'NOASSIGN' END 
                             FROM CLASSINFO_STUDENTS 
                            WHERE CLASS_ID = ${req.body.classId}),
           UDT_ID = '${req.body.creId}',
           UDT_DTM = NOW()
     WHERE CLASS_ID = ${req.body.classId};
     `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classinfo/assigned/save called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classinfo/assigned/save called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//saveAssigned

module.exports = {
    saveClassinfo,
    saveAssigned
}
