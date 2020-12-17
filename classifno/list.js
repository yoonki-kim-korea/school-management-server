const Log = require('../utils/debug.js');

/**
 * 학급 목록 조회
 */    
classinfoList = (req, res, connection) => { 
    
    let sql = `
    SELECT A.CLASS_ID AS "classId",
           A.SEMESTER_ID AS "semesterId",
           B.SEMESTER_NAME AS "semesterName",
           A.CLASSROOM_ID AS "classroomId",
           C.CLASSROOM_NAME AS "classroomName",
           A.TEACHER_ID AS "teacherId",
           D.TEACHER_NAME AS "teacherName",
           A.CLASS_CAPACITY AS "classCapacity",
           CASE WHEN J.CLASS_ASSIGN IS NULL THEN 0 ELSE J.CLASS_ASSIGN END AS "classAssign",
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
           A.SCHOOLFEE_TYPE AS "schoolfeeType",
           B.START_DATE AS "startDate" #학급 수강생들의 수강시작일을 저장하기 위함
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
                      GROUP BY CLASS_ID) J ON J.CLASS_ID = A.CLASS_ID
    WHERE A.USE_YN = 'Y'
    `;

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

    if(!!req.query.classStatus) {
        if(req.query.classStatus === 'NOASSIGN_ASSIGN'){
            sql += "\n" + `AND A.CLASS_STATUS IN ('NOASSIGN', 'ASSIGN')`; 
        }else{
            sql += "\n" + `AND A.CLASS_STATUS = '${req.query.classStatus}'`; 
        }
    }else{        
        sql += "\n" + `AND A.CLASS_STATUS IN ('NOASSIGN', 'ASSIGN')`; 
    }

    sql += `
    ORDER BY A.CLASS_ID `; 

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/classinfo/list failed. sql=${sql}, error=${err}`);
                res.send({"classinfos": []});
            }else{             
                let classinfos = [];
                for(let i=0; i < rows.length; i++){
                    classinfos.push(rows[i]);
                }
                Log.print(`/api/classinfo/list called  sql=${sql}`);
                res.send({"classinfos": classinfos});
            }
        }
    );
}//classinfoList

/**
 * 반배치 후보자 조회 
 */
candidateList = (req, res, connection) => { 
    
    let sql = `
    SELECT  A.STUDENT_ID     AS "studentId",
            A.STUDENT_NO     AS "studentNo",
            A.KOREAN_NAME    AS "koreanName",
            A.BIRTHDAY       AS "birthday",
            B.CLASS_NAME AS "className",
            B.DEPARTMENT AS "department",
            B.CLASS_STATUS AS "classStatus",
            A.GERMAN_NAME AS "germanName",
            A.ENTRANCE_DAY AS "entranceDay",
            C.FATHER_NAME AS "fatherName",
            C.MOTHER_NAME AS "motherName"
            
        FROM STUDENT_BASIC_INFO A

        LEFT OUTER JOIN STUDENT_HISTORY G
        ON A.STUDENT_ID = G.STUDENT_ID AND A.LAST_HISTORY_SEQ = G.HISTORY_SEQ
        
        INNER JOIN STUDENT_FAMILY C
        ON A.STUDENT_ID = C.STUDENT_ID

        LEFT OUTER JOIN (SELECT A.CLASS_ID
                              , A.STUDENT_ID
                              , B.CLASS_NAME
                              , D.CODE_NAME AS DEPARTMENT
                              , E.CODE_NAME AS CLASS_STATUS
                              , B.SEMESTER_ID
                              , B.GRADE
                              , B.DEPARTMENT AS DEPARTMENT_ID
                              , B.CLASS_NO
                              , B.CLASS_TIME
						   FROM CLASSINFO_STUDENTS A
                        LEFT JOIN CLASS_INFO B
                        ON A.CLASS_ID = B.CLASS_ID
                        LEFT OUTER JOIN COMMON_CODE D
                        ON B.DEPARTMENT = D.CODE
                        AND D.SUPER_CODE = 'DEPARTMENT'    
                        LEFT OUTER JOIN COMMON_CODE E
                        ON B.CLASS_STATUS = E.CODE
                        AND E.SUPER_CODE = 'CLASS_STATUS') B
        ON A.STUDENT_ID = B.STUDENT_ID
       
        WHERE 1=1        
        AND G.STUDENT_STATUS = 'STD'
        AND A.USE_YN = 'Y' 
        AND A.STUDENT_ID NOT IN (SELECT D.STUDENT_ID FROM CLASSINFO_STUDENTS D WHERE D.CLASS_ID = ${req.query.classId})     
    `;

    if(!!req.query.semester) {
        sql += "\n" + `AND B.SEMESTER_ID = '${req.query.semester}'`; 
    }

    if(!!req.query.department) {
        sql += "\n" + `AND B.DEPARTMENT_ID = '${req.query.department}'`; 
    }

    if(!!req.query.grade) {
        sql += "\n" + `AND B.GRADE = '${req.query.grade}'`; 
    }

    if(!!req.query.classNo) {
        sql += "\n" + `AND B.CLASS_NO = '${req.query.classNo}'`; 
    }

    if(!!req.query.classTime) {
        sql += "\n" + `AND B.CLASS_TIME = '${req.query.classTime}'`; 
    }

    if(!!req.query.studentNo) {
        sql += "\n" + `AND (A.STUDENT_NO = '${req.query.studentNo}' OR A.KOREAN_NAME LIKE '${req.query.studentNo}%' OR A.GERMAN_NAME LIKE '${req.query.studentNo}%')`; 
    }

    sql += `
    ORDER BY A.KOREAN_NAME `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/classinfo/candidate/list failed. sql=${sql}, error=${err}`);
                res.send({"candidates": []});
            }else{              
                let candidates = [];
                for(let i=0; i < rows.length; i++){
                    candidates.push(rows[i]);
                }
                Log.print(`/api/classinfo/candidate/list called  sql=${sql}`);
                res.send({"candidates": candidates});
            }
        }
    );
}//candidateList

/**
 * 이미 배정된 학생 목록조회 
 */
assignList = (req, res, connection) => { 
    
    let sql = `        
        SELECT A.STUDENT_ID AS "studentId",
               B.STUDENT_NO AS "studentNo",
               B.KOREAN_NAME AS "koreanName",
               B.BIRTHDAY AS "birthday"
          FROM CLASSINFO_STUDENTS A
        INNER JOIN STUDENT_BASIC_INFO B
           ON A.STUDENT_ID = B.STUDENT_ID
        WHERE A.CLASS_ID = ${req.query.classId}
    ORDER BY B.KOREAN_NAME `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/classinfo/assign/list failed. sql=${sql}, error=${err}`);
                res.send({"assigns": []});
            }else{            
                let assigns = [];
                for(let i=0; i < rows.length; i++){
                    assigns.push(rows[i]);
                }
                Log.print(`/api/classinfo/assign/list called.  sql=${sql}`);
                res.send({"assigns": assigns});
            }
        }
    );
}//assignList

/**
 * 학급정보 중복 확인
 */    
classinfoDuplCheckList = (req, res, connection) => {     
    
    let sql = `
    SELECT CASE WHEN COUNT(*) = 0 THEN 'Y' ELSE 'N' END AS RESULT 
    FROM CLASS_INFO
    WHERE USE_YN = 'Y'
    AND SEMESTER_ID = ${req.query.semesterId}
    AND DEPARTMENT = ${req.query.department}
    AND GRADE = ${req.query.grade}
    AND CLASS_NO = ${req.query.classNo}
    AND CLASS_TYPE = '${req.query.classType}'
    AND CLASS_TIME = '${req.query.classTime}'
    `;
    if(!!req.query.classId){
        sql += `AND CLASS_ID != ${req.query.classId}`;
    }

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/classinfo/dupl/list failed. sql=${sql}, error=${err}`);
                res.send({"duplCheck": [{"RESULT":"N"}]});
            }else{            
                let duplCheck = [];
                for(let i=0; i < rows.length; i++){
                    duplCheck.push(rows[i]);
                }                
                Log.print(`/api/classinfo/dupl/list called. duplCheck=${duplCheck[0].RESULT}`);
                res.send({"duplCheck": duplCheck});
            }
        }
    );
}//classinfoDuplCheckList

module.exports = {
    classinfoList,
    candidateList,
    assignList,
    classinfoDuplCheckList
}