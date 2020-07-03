const Log = require('../utils/debug.js');

/**
 * 재학생 학생기본정보 상세보기
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function viewBasicInfo(req, res, connection)  {

    let sql = 
    `SELECT A.STUDENT_ID AS "studentId",
            A.STUDENT_NO AS "studentNo",
            A.KOREAN_NAME AS "koreanName",
            A.GERMAN_NAME AS "germanName",
            A.BIRTHDAY AS "birthday",
            A.MOBILE_NO AS "mobileNo",
            A.GENDER AS "gender",
            D.CODE_NAME AS "genderStr",
            A.BIRTH_PLACE AS "birthPlace",
            E.CODE_NAME AS "birthPlaceStr",
            A.PLZ AS "plz",
            A.ADDRESS_CITY AS "addressCity",
            A.ADDRESS_DTL AS "addressDtl",
            A.ENTRANCE_DAY AS "entranceDay",
            A.EMAIL AS "email"

        FROM STUDENT_BASIC_INFO A         
        LEFT OUTER JOIN COMMON_CODE D ON D.SUPER_CODE = 'GENDER' AND D.CODE = A.GENDER
        LEFT OUTER JOIN COMMON_CODE E ON E.SUPER_CODE = 'BIRTH_PLACE_CD' AND E.CODE = A.BIRTH_PLACE 
        WHERE A.STUDENT_ID = ${req.query.studentId}`;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/teacher/view/basic failed. sql=${sql}, err=${err}`);
                res.send({"basicInfo": {}});  
            }else{
                let basicInfo = {};
                if(rows && rows.length == 1){
                    Log.print(`/api/teacher/view/basic called . sql=${sql} STUDENT_ID=${req.query.studentId}`);
                    res.send({"basicInfo": rows[0]});    
                }        
            }
        }
    );
}//viewBasicInfo

/**
 * 재학생 가족정보 상세보기
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function viewFamilyInfo(req, res, connection)  {

    let sql = 
    `SELECT B.STUDENT_ID AS "studentId",
            B.FATHER_NAME AS "fatherName",
            B.MOTHER_NAME AS "motherName",
            B.FATHER_NAME_ENG AS "fatherNameEng",
            B.MOTHER_NAME_ENG AS "motherNameEng",  
            B.REPRESENT_YN AS "representYn",
            B.FATHER_PHONE_NO AS "fatherPhoneNo",
            B.MOTHER_PHONE_NO AS "motherPhoneNo",
            B.BANK AS "bank",
            C.CODE_NAME AS "bankStr",
            B.ACCOUNT_NO AS "accountNo",
            B.ACCOUNT_HOLDER AS "accountHolder",
            B.IBAN AS "iban",
            B.BIC AS "bic"     

        FROM STUDENT_FAMILY B

        LEFT OUTER JOIN COMMON_CODE C ON C.SUPER_CODE = 'BANK_CD' AND C.CODE = B.BANK
        WHERE B.STUDENT_ID = ${req.query.studentId}`;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/view/family failed sql=${sql}, err=${err}`);
                res.send({"familyInfo": {}});   
            }else{
                let familyInfo = {};
                Log.print(`/api/student/view/family called. sql=${sql} STUDENT_ID=${req.query.studentId}`);
                if(rows && rows.length == 1){
                    res.send({"familyInfo": rows[0]});    
                }        
            }
        }
    );
}//viewFamilyInfo

/**
 * 학생 수강이력
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function classHistoryList(req, res, connection)  {   
   
    let sql = `
	SELECT C.SEMESTER_NAME AS "semester",
		   CONCAT(C2.CODE_NAME, ' ', B.CLASS_NAME) AS "grade",
		   D.START_DATE AS "startDate",
		   IFNULL(D.END_DATE,'') AS "endDate",
		   E.TEACHER_NAME AS "teacher",
		   C5.CODE_NAME AS "completeYn",
           C3.CODE_NAME AS "redunction",
           IFNULL(C4.CODE_NAME, '')  AS "abandonReason"
	FROM STUDENT_CLASS_HISTORY A

	LEFT OUTER JOIN CLASS_INFO B ON A.CLASS_ID = B.CLASS_ID
	LEFT OUTER JOIN SEMESTER C ON B.SEMESTER_ID = C.SEMESTER_ID
	LEFT OUTER JOIN CLASSINFO_STUDENTS D ON A.CLASS_ID = D.CLASS_ID AND A.STUDENT_ID = D.STUDENT_ID
	LEFT OUTER JOIN TEACHER E ON B.TEACHER_ID = E.TEACHER_ID

	LEFT OUTER JOIN COMMON_CODE C1 ON C1.SUPER_CODE = 'GRADE' AND B.GRADE = C1.CODE
	LEFT OUTER JOIN COMMON_CODE C2 ON C2.SUPER_CODE = 'DEPARTMENT' AND B.DEPARTMENT = C2.CODE
	LEFT OUTER JOIN COMMON_CODE C3 ON C3.SUPER_CODE = 'REDUCTION_TYPE' AND D.REDUCTION_TYPE = C3.CODE
	LEFT OUTER JOIN COMMON_CODE C4 ON C4.SUPER_CODE = 'ABANDON_REASON' AND D.ABANDON_REASON = C4.CODE
	LEFT OUTER JOIN COMMON_CODE C5 ON C5.SUPER_CODE = 'COMPLETE_YN' AND D.COMPLETE_YN = C5.CODE
    WHERE A.STUDENT_ID = ${req.query.studentId}
    AND B.CLASS_TYPE =  '${req.query.classType}'
    ORDER BY C.SEMESTER_ID DESC 
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/class/hist failed. sql=${sql}, err=${err}`);
                res.send({"courseHistory": []});
            }else{            
                let courseHistory = [];
                for(let i=0; i < rows.length; i++){
                    courseHistory.push(rows[i]);
                }
                Log.print(`/api/student/class/hist called. sql=${sql} count=${rows.length}`);
                res.send({"courseHistory": courseHistory});
            }
        }
    );
};//classHistoryList

/**
 * 문서발행이력
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function documentHistoryList(req, res, connection)  {   
   
    let sql = `
    SELECT ISSUED_DATE AS "issuedDate",
           C2.CODE_NAME AS "documentType",
           CONCAT(ISSUED_DATE, '-', DOCUMENT_TYPE, '-', SEQ_NO) AS "seqNo" 
    FROM ISSUED A
    LEFT OUTER JOIN COMMON_CODE C1 ON C1.SUPER_CODE = 'DOCUMENT_TYPE' AND A.DOCUMENT_TYPE = C1.CODE 
    LEFT OUTER JOIN COMMON_CODE C2 ON C2.SUPER_CODE = 'DOCUMENT' AND C2.CODE = C1.CODE_NAME 
    WHERE STUDENT_ID = ${req.query.studentId}
    ORDER BY A.CRE_DTM DESC
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/document/hist failed. sql=${sql}, err=${err}`);
                res.send({"results": []});
            }else{              
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/student/document/hist called. sql=${sql} count=${rows.length}`);
                res.send({"results": results});
            }
        }
    );
};//documentHistoryList

/**
 * 학생 상태이력
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function studentStatus(req, res, connection)  {   
   
    let sql = `
    SELECT seq, day, status, leaveAbsense
    FROM (    
        SELECT 0 AS "seq",
            B.ENTRANCE_DAY AS "day",
            '입학' AS "status",
            '' AS "leaveAbsense"
        FROM STUDENT_BASIC_INFO B
        WHERE B.STUDENT_ID = ${req.query.studentId}
        UNION
        SELECT A.HISTORY_SEQ+1 AS "seq",
            A.INPUT_DATE AS "day",
            C1.CODE_NAME AS "status",
            C2.CODE_NAME AS "leaveAbsense"
        FROM STUDENT_HISTORY A
        LEFT OUTER JOIN COMMON_CODE C1 ON C1.SUPER_CODE = 'STUDENT_STATUS' AND A.STUDENT_STATUS = C1.CODE
        LEFT OUTER JOIN COMMON_CODE C2 ON C2.SUPER_CODE = 'LEAVE_ABSENSE' AND A.LEAVE_ABSENSE = C2.CODE
        WHERE 1=1
        AND A.STUDENT_ID = ${req.query.studentId}
    ) A
    ORDER BY A.seq DESC
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/student/status/hist failed. sql=${sql}, error=${err}`);
                res.send({"results": []});
            }else{              
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/student/status/hist called . sql=${sql} count=${rows.length}`);
                res.send({"results": results});
            }
        }
    );
};//studentStatus

module.exports = {
    viewBasicInfo,
    viewFamilyInfo,
    classHistoryList,
    documentHistoryList,
    studentStatus
}