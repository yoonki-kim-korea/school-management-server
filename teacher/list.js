const Log = require('../utils/debug.js');

/**
 * 교사목록 조회
 */
teacherList = (req, res, connection) => {    
    let teacherId     = req.query.teacherId;
    let teacherName   = req.query.teacherName;
    let teacherNo     = req.query.teacherNo;
    let workStatus    = req.query.workStatus;
    let teacherSearch = req.query.teacherSearch;
    let searchKeyword = req.query.searchKeyword;    
    let department    = req.query.department;
    let grade         = req.query.grade;
    let classTime     = req.query.classTime;
    let classNo       = req.query.classNo;
    let classType     = req.query.classType;
    let teacherDate   = req.query.teacherDate;
    let startDate     = req.query.startDate;
    let endDate       = req.query.endDate;
    let duty          = req.query.duty;

    let sql = `
    SELECT  A.TEACHER_ID AS "teacherId",
            A.TEACHER_NO AS "teacherNo",
            A.TEACHER_NAME AS "teacherName",
            A.TEACHER_ENG_NAME AS "teacherEngName",
            A.BIRTHDAY AS "birthday",
            A.GENDER AS "gender",
            B.CODE_NAME AS "genderStr",
            A.JOIN_DAY AS "joinDay",
            IFNULL(A.RESIGN_DAY,'') AS "resignDay",
            A.WORK_STATUS AS "workStatus",
            C.CODE_NAME AS "workStatusStr",
            A.GENDER AS "gender",
            A.EMAIL AS "email",
            A.MOBILE_NO AS "mobileNo",
            A.PLZ AS "plz",
            A.ADDRESS_CITY AS "addressCity",
            A.ADDRESS_DTL AS "addressDtl",          
            A.DUTY AS "duty",  
            K.CODE_NAME AS "dutyName",
            CONCAT(E.SEMESTER_NAME, ' ', F.CODE_NAME, ' ', G.CODE_NAME, ' ', H.CODE_NAME, ' ', I.CODE_NAME, ' ', J.CODE_NAME) AS "myClass",
            CONCAT(F.CODE_NAME, ' ', D.GRADE, '-', D.CLASS_NO, ' ', I.CODE_NAME) AS "myClass2"
        FROM TEACHER A
        LEFT OUTER JOIN COMMON_CODE B ON B.SUPER_CODE = 'GENDER' AND B.CODE = A.GENDER
        LEFT OUTER JOIN COMMON_CODE C ON C.SUPER_CODE = 'WORK_STATUS' AND C.CODE = A.WORK_STATUS
        LEFT OUTER JOIN CLASS_INFO D ON A.TEACHER_ID = D.TEACHER_ID AND D.CLASS_STATUS = 'OPERATING'
        LEFT OUTER JOIN SEMESTER E ON D.SEMESTER_ID = E.SEMESTER_ID
        LEFT OUTER JOIN COMMON_CODE F ON F.SUPER_CODE = 'DEPARTMENT' AND F.CODE = D.DEPARTMENT
        LEFT OUTER JOIN COMMON_CODE G ON G.SUPER_CODE = 'GRADE' AND G.CODE = D.GRADE
        LEFT OUTER JOIN COMMON_CODE H ON H.SUPER_CODE = 'CLASS_NO' AND H.CODE = D.CLASS_NO
        LEFT OUTER JOIN COMMON_CODE I ON I.SUPER_CODE = 'CLASS_TIME' AND I.CODE = D.CLASS_TIME
        LEFT OUTER JOIN COMMON_CODE J ON J.SUPER_CODE = 'CLASS_TYPE' AND J.CODE = D.CLASS_TYPE
        LEFT OUTER JOIN COMMON_CODE K ON K.SUPER_CODE = 'DUTY' AND K.CODE = A.DUTY
        WHERE A.USE_YN = 'Y'
    `;
    
    //교사ID
    if(!!teacherId) {
        sql += "\n" + `AND A.TEACHER_ID = '${teacherId}'`; 
    }
    
    //교사명
    if(!!teacherName) {
        sql += "\n" + `AND A.TEACHER_NAME = '${teacherName}'`; 
    }
    
    //교사번호
    if(!!teacherNo) {
        sql += "\n" + `AND A.TEACHER_NO = '${teacherNo}'`; 
    }
    
    //재직상태
    if(!!workStatus) {
        sql += "\n" + `AND A.WORK_STATUS = '${workStatus}'`; 
    }

    //부서
    if(!!department) {
        sql += "\n" + `AND D.DEPARTMENT = '${department}'`; 
    }

    //학년
    if(!!grade) {
        sql += "\n" + `AND D.GRADE = '${grade}'`; 
    }

    //반
    if(!!classNo) {
        sql += "\n" + `AND D.CLASS_NO = '${classNo}'`; 
    }

    //수업시간
    if(!!classTime) {
        sql += "\n" + `AND D.CLASS_TIME = '${classTime}'`; 
    }

    //유형
    if(!!classType) {
        sql += "\n" + `AND D.CLASS_TYPE = '${classType}'`; 
    }

    //직무
    if(!!duty) {
        sql += "\n" + `AND A.DUTY = '${duty}'`; 
    }

    switch(teacherSearch){
        case 'MN'://전화번호
        if(!!searchKeyword) {
            sql += "\n" + `AND A.MOBILE_NO LIKE '${searchKeyword}%'`; 
        }    
        break;

        case 'AD'://주소
        if(!!searchKeyword) {
            sql += "\n" + `AND (LOWER(A.ADDRESS_CITY) LIKE LOWER('${searchKeyword}%')`; 
            sql += "\n" + `  OR LOWER(A.ADDRESS_DTL) LIKE LOWER('${searchKeyword}%')) `; 
        }    
        break;

        case 'EM'://이메일
        if(!!searchKeyword) {
            sql += "\n" + `AND A.EMAIL LIKE '${searchKeyword}%'`; 
        }    
        break;

        case 'TN'://교직원번호
        if(!!searchKeyword) {
            sql += "\n" + `AND A.TEACHER_NO = '${searchKeyword}'`; 
        }    
        break;
    }

    //날짜-생일,임용일자, 퇴사일자
    switch(teacherDate){
        case 'BD': //생일
        if(!!startDate) {
            sql += "\n" + `AND A.BIRTHDAY >= REPLACE('${startDate}', '-', '')`; 
        }
        if(!!endDate) {
            sql += "\n" + `AND A.BIRTHDAY <= REPLACE('${endDate}', '-', '')`; 
        }
        break;

        case 'JD': //임용일자
        if(!!startDate) {
            sql += "\n" + `AND A.JOIN_DAY >= REPLACE('${startDate}', '-', '')`; 
        }
        if(!!endDate) {
            sql += "\n" + `AND A.JOIN_DAY <= REPLACE('${endDate}', '-', '')`; 
        }
        break;

        case 'RS': //퇴직일자
        if(!!startDate) {
            sql += "\n" + `AND A.RESIGN_DAY >= REPLACE('${startDate}', '-', '')`; 
        }
        if(!!endDate) {
            sql += "\n" + `AND A.RESIGN_DAY <= REPLACE('${endDate}', '-', '')`; 
        }
        break;
    }
    
    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/teacher/list failed. sql=${sql}, err=${err}`);
                res.send({"teachers": []});   
            }else{           
                let teachers = [];
                for(let i=0; i < rows.length; i++){
                    teachers.push(rows[i]);
                }
                res.send({"teachers": teachers});                
                Log.print(`/api/teacher/list called. sql=${sql} count=${rows.length}`);
            }
        }
    );
};

module.exports = {
    teacherList
}