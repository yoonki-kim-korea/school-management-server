const Log = require('../utils/debug.js');

/**
 * 교직원 상세
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function viewBasicInfo(req, res, connection)  {    
    let sql = `
    SELECT  A.TEACHER_ID AS "teacherId",
            A.TEACHER_NO AS "teacherNo",
            A.TEACHER_NAME AS "teacherName",
            A.TEACHER_ENG_NAME AS "teacherEngName",
            A.BIRTHDAY AS "birthday",
            A.GENDER AS "gender",
            B.CODE_NAME AS "genderStr",
            A.JOIN_DAY AS "joinDay",
            A.RESIGN_DAY AS "resignDay",
            A.WORK_STATUS AS "workStatus",
            C.CODE_NAME AS "workStatusStr",
            A.GENDER AS "gender",
            A.EMAIL AS "email",
            A.MOBILE_NO AS "mobileNo",
            A.DUTY AS "duty",  
            K.CODE_NAME AS "dutyName",
            A.PLZ AS "plz",
            A.ADDRESS_CITY AS "addressCity",
            A.ADDRESS_DTL AS "addressDtl"
        FROM TEACHER A
        LEFT OUTER JOIN COMMON_CODE B ON B.SUPER_CODE = 'GENDER' AND B.CODE = A.GENDER
        LEFT OUTER JOIN COMMON_CODE C ON C.SUPER_CODE = 'WORK_STATUS' AND C.CODE = A.WORK_STATUS
        LEFT OUTER JOIN COMMON_CODE K ON K.SUPER_CODE = 'DUTY' AND K.CODE = A.DUTY
        WHERE A.USE_YN = 'Y'
        AND A.TEACHER_ID =  ${req.query.teacherId}
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/teacher/view/basic failed . sql=${sql} err=${err}`);
                res.send({"basicInfo": {}, "result":"failed", "error":err});   
            }else{
                Log.print(`/api/teacher/view/basic called . sql=${sql} TEACHER_ID=${req.query.teacherId}`);
                if(rows && rows.length == 1){
                    res.send({"basicInfo": rows[0], "result":"success"});    
                }else{
                    res.send({"basicInfo": {}, "result":"success"});    
                }
            }
        }
    );
}//viewBasicInfo

/**
 * 담임이력
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function courseHistory(req, res, connection)  {    
    let sql = `
    SELECT C.SEMESTER_NAME AS "semester",
           CONCAT(C2.CODE_NAME, ' ', B.CLASS_NAME) AS "grade",
           C.START_DATE AS "startDate",
           C.END_DATE AS "endDate"
    FROM CLASS_INFO B 
    LEFT OUTER JOIN SEMESTER C ON B.SEMESTER_ID = C.SEMESTER_ID
    LEFT OUTER JOIN COMMON_CODE C1 ON C1.SUPER_CODE = 'GRADE' AND B.GRADE = C1.CODE
    LEFT OUTER JOIN COMMON_CODE C2 ON C2.SUPER_CODE = 'DEPARTMENT' AND B.DEPARTMENT = C2.CODE
    WHERE B.TEACHER_ID = ${req.query.teacherId}
    ORDER BY B.CLASS_ID, B.CLASS_TYPE
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/teacher/course/list failed. sql=${sql}, error=${err}`);
                res.send({"results": []});
            }else{       
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/teacher/course/list called. sql=${sql} count=${rows.length}`);
                res.send({"results": results});
            }
        }
    );
}//courseHistory

module.exports = {
    viewBasicInfo,
    courseHistory
}