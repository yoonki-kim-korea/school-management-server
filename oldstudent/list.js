const Log = require('../utils/debug.js');


//학생목록 조회
studentList = (req, res, connection) => {    
    let studentId     = req.query.studentId;
    let studentNo     = req.query.studentNo;
    let studentSearch = req.query.studentSearch;
    let searchKeyword = req.query.searchKeyword;
    let gender        = req.query.gender;
    let teacher = req.query.teacher;
    let department    = req.query.department;
    let grade   = req.query.grade;
    let classNo   = req.query.classNo;
    let classTime     = req.query.classTime;
    let studentDate   = req.query.studentDate;
    let startDate     = req.query.startDate;
    let endDate       = req.query.endDate;

    /**
     * 재학생만 보여준다 STUDENT_STATUS = 'STD'
     */
    let sql = `
    SELECT  A.STUDENT_ID     AS "studentId",
            A.STUDENT_NO     AS "studentNo",
            A.KOREAN_NAME    AS "koreanName",
            A.GERMAN_NAME    AS "germanName",
            A.BIRTHDAY       AS "birthday",
            A.MOBILE_NO      AS "mobileNo",
            A.GENDER         AS "gender",
            A.BIRTH_PLACE    AS "birthPlace",
            A.PLZ            AS "plz",
            A.ADDRESS_CITY   AS "addressCity",
            A.ADDRESS_DTL    AS "addressDtl",
            B.FATHER_NAME    AS "fatherName",
            B.MOTHER_NAME    AS "motherName",
            A.ENTRANCE_DAY   AS "entranceDay",
            CONCAT(C2.CODE_NAME, ' ', E.CLASS_NAME)    AS "currentSemester",
            T.TEACHER_NAME   AS "classTeacher",
            A.EMAIL          AS "email",
            C1.CODE_NAME     AS "studentStatusName",
            A.GRADUATE_DAY   AS "graduateDay",
            CASE WHEN G.STUDENT_STATUS = 'LEV' THEN G.INPUT_DATE ELSE '' END AS "levDay"

    FROM STUDENT_BASIC_INFO A

    LEFT OUTER JOIN STUDENT_HISTORY G
    ON A.STUDENT_ID = G.STUDENT_ID AND A.LAST_HISTORY_SEQ = G.HISTORY_SEQ

    LEFT OUTER JOIN COMMON_CODE C1
    ON C1.SUPER_CODE = 'STUDENT_STATUS' AND C1.CODE = G.STUDENT_STATUS  
    
    LEFT OUTER JOIN STUDENT_FAMILY B
    ON A.STUDENT_ID = B.STUDENT_ID
    
	LEFT OUTER JOIN CLASS_INFO E
	ON E.CLASS_ID = A.LAST_CLASS_ID
	
	LEFT OUTER JOIN TEACHER T
	ON T.TEACHER_ID = E.TEACHER_ID

    LEFT OUTER JOIN COMMON_CODE C2
    ON C2.SUPER_CODE = 'DEPARTMENT' AND C2.CODE = E.DEPARTMENT      

    WHERE 1=1
    AND A.USE_YN ='Y'
    AND G.STUDENT_STATUS IN('LEV', 'GRD')
`;
    //학번
    if(!!studentId) {
        sql += "\n" + `AND A.STUDENT_ID = '${studentId}'`; 
    }
    //학번
    if(!!studentNo) {
        sql += "\n" + `AND A.STUDENT_NO = '${studentNo}'`; 
    }
    
    //부서
    if(!!department) {
        sql += "\n" + `AND E.DEPARTMENT = '${department}'`; 
    }
    
    //학년
    if(!!grade) {
        sql += "\n" + `AND E.GRADE = '${grade}'`; 
    }

    //반번호
    if(!!classNo) {
        sql += "\n" + `AND E.CLASS_NO = '${classNo}'`; 
    }

    //학생상태
    if(!!req.query.studentStatus) {
        sql += "\n" + `AND G.STUDENT_STATUS = '${req.query.studentStatus}'`; 
    }
    
    //시간구분-오전,오후
    if(!!classTime) {
        sql += "\n" + `AND E.CLASS_TIME = '${classTime}'`; 
    }
    switch(studentSearch){
        case 'KN'://한글성명
        if(!!searchKeyword) {
            sql += "\n" + `AND A.KOREAN_NAME LIKE '${searchKeyword}%'`; 
        }    
        break;

        case 'GN'://독어성명
        if(!!searchKeyword) {
            sql += "\n" + `AND LOWER(A.GERMAN_NAME) LIKE LOWER('${searchKeyword}%') `; 
        }    
        break;

        case 'MP'://핸드폰
        if(!!searchKeyword) {
            sql += "\n" + `AND REPLACE(A.MOBILE_NO, '-', '') LIKE '${searchKeyword}%'`; 
        }    
        break;

        case 'EM'://이메일
        if(!!searchKeyword) {
            sql += "\n" + `AND LOWER(A.EMAIL) LIKE LOWER('${searchKeyword}%')`; 
        }    
        break;

        case 'PN'://부모성명
        if(!!searchKeyword) {
            sql += "\n" + `AND (LOWER(B.MOTHER_NAME) LIKE LOWER('${searchKeyword}%')  OR LOWER(B.FATHER_NAME) LIKE LOWER('${searchKeyword}%'))`; 
        }    
        break;
    }

    //성별
    if(!!gender) {
        sql += "\n" + `AND A.GENDER = '${gender}'`; 
    }
    
    //담임
    if(!!teacher) {
        sql += "\n" + `AND E.TEACHER_ID = '${teacher}'`; 
    }

    //날짜-생일,입학일
    switch(studentDate){
        case 'BIRTHDAY': //생일
        if(!!startDate) {
            sql += "\n" + `AND A.BIRTHDAY >= '${startDate}'`; 
        }
        if(!!endDate) {
            sql += "\n" + `AND A.BIRTHDAY <= '${endDate}'`; 
        }
        break;

        case 'ENTRANCEDAY': //입학
        if(!!startDate) {
            sql += "\n" + `AND A.ENTRANCE_DAY >= '${startDate}'`; 
        }
        if(!!endDate) {
            sql += "\n" + `AND A.ENTRANCE_DAY <= '${endDate}'`; 
        }
        break;

        case 'GRADUATE': //졸업
        if(!!startDate) {
            sql += "\n" + `AND A.GRADUATE_DAY >= '${startDate}'`; 
        }
        if(!!endDate) {
            sql += "\n" + `AND A.GRADUATE_DAY <= '${endDate}'`; 
        }
        break;

        case 'LEAVE': //휴학
        if(!!startDate) {
            sql += "\n" + `AND G.INPUT_DATE >= '${startDate}'`; 
        }
        if(!!endDate) {
            sql += "\n" + `AND G.INPUT_DATE <= '${endDate}'`; 
        }
        break;
    }

    sql += `
        ORDER BY A.STUDENT_NO`;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/list failed. sql=${sql}, error=${err}`);
                res.send({"students": []});                
            }else{                          
                let students = [];
                for(let i=0; i < rows.length; i++){
                    students.push(rows[i]);
                }
                Log.print(`/api/student/list called. sql=${sql} count=${rows.length}`);
                res.send({"students": students});                
            }
        }
    );
};

module.exports = {
    studentList
}