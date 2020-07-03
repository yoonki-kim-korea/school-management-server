const Log = require('../utils/debug.js');

/**
 * 종강학급 목록 조회
 */    
endclassList = (req, res, connection) => { 
    
    let sql = `
    SELECT A.CLASS_ID AS "classId",
           A.SEMESTER_ID AS "semesterId",
           B.SEMESTER_NAME AS "semesterName",
           A.CLASSROOM_ID AS "classroomId",
           C.CLASSROOM_NAME AS "classroomName",
           A.TEACHER_ID AS "teacherId",
           D.TEACHER_NAME AS "teacherName",
           A.CLASS_CAPACITY AS "classCapacity",
           CASE WHEN K.CLASS_ASSIGN IS NULL THEN 0 ELSE K.CLASS_ASSIGN END AS "classAssign",
           A.CLASS_STATUS AS "classStatus",
           G.CODE_NAME AS "classStatusName",
           A.DEPARTMENT AS "department",
           E.CODE_NAME AS "departmentName",
           A.GRADE AS "grade",
           F.CODE_NAME AS "gradeName",
           A.CLASS_NO AS "classNo",
           A.CLASS_TIME AS "classTime",
           I.CODE_NAME AS "classTimeName",
           H.CODE_NAME AS "classNoName",
           A.CLASS_NAME AS "className",
           A.CLASS_TYPE AS "classType",
           J.CODE_NAME AS "classTypeName",
           CONCAT(B.SEMESTER_NAME, ' ', E.CODE_NAME, ' ', A.CLASS_NAME, ' ', I.CODE_NAME) AS "fileName",           
           DATE_FORMAT(B.START_DATE, '%Y-%m-%d') AS "startDate",
           A.SCHOOLFEE_TYPE AS "schoolfeeType"
    FROM CLASS_INFO A
    
    LEFT OUTER JOIN SEMESTER B ON A.SEMESTER_ID = B.SEMESTER_ID 
    LEFT OUTER JOIN CLASSROOM C ON A.CLASSROOM_ID = C.CLASSROOM_ID
    LEFT OUTER JOIN TEACHER D ON A.TEACHER_ID = D.TEACHER_ID
    LEFT OUTER JOIN COMMON_CODE E ON E.SUPER_CODE = 'DEPARTMENT' AND A.DEPARTMENT = E.CODE
    LEFT OUTER JOIN COMMON_CODE F ON F.SUPER_CODE = 'GRADE' AND A.GRADE = F.CODE
    LEFT OUTER JOIN COMMON_CODE G ON G.SUPER_CODE = 'CLASS_STATUS' AND A.CLASS_STATUS = G.CODE
    LEFT OUTER JOIN COMMON_CODE H ON H.SUPER_CODE = 'CLASS_NO' AND A.CLASS_NO = H.CODE
    LEFT OUTER JOIN COMMON_CODE I ON I.SUPER_CODE = 'CLASS_TIME' AND A.CLASS_TIME = I.CODE
    LEFT OUTER JOIN COMMON_CODE J ON J.SUPER_CODE = 'CLASS_TYPE' AND A.CLASS_TYPE = J.CODE
    LEFT OUTER JOIN (SELECT CLASS_ID, 
                            COUNT(STUDENT_ID) AS CLASS_ASSIGN
                       FROM CLASSINFO_STUDENTS
                       WHERE USE_YN = 'Y'
                      GROUP BY CLASS_ID) K ON K.CLASS_ID = A.CLASS_ID
    WHERE A.USE_YN = 'Y'
    AND A.CLASS_STATUS = 'END'
    `;

    if(!!req.query.classId) {
        sql += "\n" + `AND A.CLASS_ID = '${req.query.classId}'`; 
    }

    if(!!req.query.semester) {
        sql += "\n" + `AND A.SEMESTER_ID = '${req.query.semester}'`; 
    }

    if(!!req.query.classroom) {
        sql += "\n" + `AND A.CLASSROOM_ID = '${req.query.classroom}'`; 
    }

    if(!!req.query.teacher) {
        sql += "\n" + `AND A.TEACHER_ID = '${req.query.teacher}'`; 
    }

    if(!!req.query.department) {
        sql += "\n" + `AND A.DEPARTMENT = '${req.query.department}'`; 
    }

    if(!!req.query.grade) {
        sql += "\n" + `AND A.GRADE = '${req.query.grade}'`; 
    }

    if(!!req.query.classNo) {
        sql += "\n" + `AND A.CLASS_NO = '${req.query.classNo}'`; 
    }

    if(!!req.query.classType) {
        sql += "\n" + `AND A.CLASS_TYPE = '${req.query.classType}'`; 
    }

    if(!!req.query.classTime) {
        sql += "\n" + `AND A.CLASS_TIME = '${req.query.classTime}'`; 
    }

    sql += `
    ORDER BY A.CLASS_ID `; 

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/endclass/list failed. sql=${sql}, error=${error}`);
                res.send({"results": []});
            }else{           
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/endclass/list called  sql=${sql}`);
                res.send({"results": results});
            }
        }
    );
}//endclassList

module.exports = {
    endclassList
}