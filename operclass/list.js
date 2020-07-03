const Log = require('../utils/debug.js');

/**
 * 운영학급관리 목록 조회
 */    
classbookList = (req, res, connection) => { 
    
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
           B.START_DATE AS "startDate",
           A.SCHOOLFEE_TYPE AS "schoolfeeType",
           B.END_DATE AS "endDate" #종강 시 수강생들의 수강종료일로 저장된다.
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
                       WHERE  ABANDON_REASON IS NULL
                      GROUP BY CLASS_ID) K ON K.CLASS_ID = A.CLASS_ID
    WHERE A.USE_YN = 'Y'
    AND A.CLASS_STATUS = 'OPERATING'
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
                Log.error(`/api/operclass/list failed. sql=${sql}, error=${err}`);
                res.send({"classbooks": []});
            }else{            
                let classbooks = [];
                for(let i=0; i < rows.length; i++){
                    classbooks.push(rows[i]);
                }
                Log.print(`/api/operclass/list called  sql=${sql}`);
                res.send({"classbooks": classbooks});
            }
        }
    );
}//classbookList

/**
 * 출석부 인쇄대상 학급 목록
 */    
classbookExcelList = (req, res, connection) => { 
    
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
           CONCAT(B.SEMESTER_NAME, ' ', E.CODE_NAME, ' ', A.CLASS_NAME, ' ', I.CODE_NAME) AS "fileName",           
           DATE_FORMAT(B.START_DATE, '%Y-%m-%d') AS "startDate"
    FROM CLASS_INFO A
    
    LEFT OUTER JOIN SEMESTER B ON A.SEMESTER_ID = B.SEMESTER_ID 
    LEFT OUTER JOIN CLASSROOM C ON A.CLASSROOM_ID = C.CLASSROOM_ID
    LEFT OUTER JOIN TEACHER D ON A.TEACHER_ID = D.TEACHER_ID
    LEFT OUTER JOIN COMMON_CODE E ON E.SUPER_CODE = 'DEPARTMENT' AND A.DEPARTMENT = E.CODE
    LEFT OUTER JOIN COMMON_CODE F ON F.SUPER_CODE = 'GRADE' AND A.GRADE = F.CODE
    LEFT OUTER JOIN COMMON_CODE G ON G.SUPER_CODE = 'CLASS_STATUS' AND A.CLASS_STATUS = G.CODE
    LEFT OUTER JOIN COMMON_CODE H ON H.SUPER_CODE = 'CLASS_NO' AND A.CLASS_NO = H.CODE
    LEFT OUTER JOIN COMMON_CODE I ON I.SUPER_CODE = 'CLASS_TIME' AND A.CLASS_TIME = I.CODE
    LEFT OUTER JOIN (SELECT CLASS_ID, 
                            COUNT(STUDENT_ID) AS CLASS_ASSIGN
                       FROM CLASSINFO_STUDENTS
                       WHERE  ABANDON_REASON IS NULL
                      GROUP BY CLASS_ID) J ON J.CLASS_ID = A.CLASS_ID
    WHERE A.USE_YN = 'Y'
    AND A.CLASS_STATUS = 'OPERATING'
    `;

    if(!!req.query.classId) {
        sql += "\n" + `AND A.CLASS_ID = '${req.query.classId}'`; 
    }

    sql += `
    ORDER BY A.CLASS_ID `;
    Log.print(`/api/operclass/excel/list called  sql=${sql}`);

    connection.query(sql,
        (err, rows, fields) => {
            try {                
                let classinfos = [];
                for(let i=0; i < rows.length; i++){
                    classinfos.push(rows[i]);
                }   
                res.send({"classinfos": classinfos});
            } catch (error) {
                Log.print(`/api/operclass/excel/list failed sql=${sql}, error=${error}`);
                res.send({"classinfos": []});
            }
        }
    );
}//classbookAdresslist

addresslist = (req, res, connection) => { 
    
    let sql = `
    SELECT A.CLASS_ID AS "classId",
        B.STUDENT_ID AS "studentId",
        C.STUDENT_NO AS "studentNo",
        C.KOREAN_NAME AS "name",
        C.MOBILE_NO AS "telephone",
        C.EMAIL AS "email",
        C.PLZ AS "plz",
        c.ADDRESS_CITY AS "addressCity",
        C.ADDRESS_DTL AS "addressDtl",
        D.FATHER_NAME AS "father",
        D.MOTHER_NAME AS "mother",
        C.GENDER AS "gender"
    FROM CLASS_INFO A

    INNER JOIN CLASSINFO_STUDENTS B
    ON A.CLASS_ID = B.CLASS_ID

    INNER JOIN STUDENT_BASIC_INFO C
    ON B.STUDENT_ID = C.STUDENT_ID

    INNER JOIN STUDENT_FAMILY D
    ON  C.STUDENT_ID = D.STUDENT_ID
    `;

    if(!!req.query.classId) {
        sql += "\n" + `AND A.CLASS_ID = '${req.query.classId}'`; 
    }

    sql += ` 
     ORDER BY A.CLASS_ID, C.KOREAN_NAME   `;    

    Log.print(`/api/operclass/address/list called  sql=${sql}`);

    connection.query(sql,
        (err, rows, fields) => {
            try {                
                let address = [];
                for(let i=0; i < rows.length; i++){
                    address.push(rows[i]);
                }
                res.send({"address": address});
            } catch (error) {
                Log.print(`/api/operclass/address/list failed sql=${sql}, error=${error}`);
                res.send({"address": []});
            }
        }
    );
}//addresslist

/**
 * 운영중인 반 학생 목록
 */
operStudentList = (req, res, connection) => { 
    
    let sql = `
    SELECT  A.STUDENT_ID AS "studentId",
            X.STUDENT_NO AS "studentNo",
            X.KOREAN_NAME AS "koreanName",
            K.CODE_NAME AS "completeYnName",
            G.CODE_NAME AS "reductionName",
            A.CLASS_ID AS "classId",
            A.REDUCTION_TYPE AS "reduction",
            A.COMPLETE_YN AS  "completeYn",
            C.START_DATE AS "startDate",
            C.END_DATE AS "endDate",
            C.SEMESTER_ID AS "semesterId",
            B.CLASS_TYPE AS "classType",
            B.SCHOOLFEE_TYPE AS "schoolfeeType"
    FROM CLASSINFO_STUDENTS A
    LEFT OUTER JOIN STUDENT_BASIC_INFO X ON X.STUDENT_ID = A.STUDENT_ID
    LEFT OUTER JOIN CLASS_INFO B ON A.CLASS_ID = B.CLASS_ID
    LEFT OUTER JOIN SEMESTER C ON B.SEMESTER_ID = C.SEMESTER_ID
    LEFT OUTER JOIN COMMON_CODE D ON D.SUPER_CODE = 'GRADE' AND B.GRADE = D.CODE
    LEFT OUTER JOIN COMMON_CODE E ON E.SUPER_CODE = 'DEPARTMENT' AND B.DEPARTMENT = E.CODE
    LEFT OUTER JOIN TEACHER F ON B.TEACHER_ID = F.TEACHER_ID
    LEFT OUTER JOIN COMMON_CODE G ON G.SUPER_CODE = 'REDUCTION_TYPE' AND A.REDUCTION_TYPE = G.CODE
    LEFT OUTER JOIN COMMON_CODE K ON K.SUPER_CODE = 'COMPLETE_YN' AND A.COMPLETE_YN = K.CODE
    WHERE  1=1
    AND ABANDON_REASON IS NULL
    AND A.CLASS_ID = ${req.query.classId}
    AND A.USE_YN = 'Y'
    ORDER BY X.KOREAN_NAME
    `;

    connection.query(sql,
        (err, rows, fields) => {
            try {       

                Log.print(`/api/operclass/management/list called  sql=${sql}`);         
                let students = [];
                for(let i=0; i < rows.length; i++){
                    students.push(rows[i]);
                }
                res.send({"students": students});
            } catch (error) {
                Log.print(`/api/operclass/management/list failed sql=${sql}, error=${error}`);
                res.send({"students": []});
            }
        }
    );
}//operStudentList

module.exports = {
    classbookList,    
    classbookExcelList,
    addresslist,
    operStudentList
}