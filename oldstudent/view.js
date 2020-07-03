const Log = require('../utils/debug.js');

/**
 * 휴학,졸업생 학생기본정보 보기
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
            A.EMAIL AS "email",
            A.GRADUATE_DAY AS "graduateDay",
            C1.CODE_NAME     AS "studentStatusName",
            G.STUDENT_STATUS     AS "studentStatus",
            CASE WHEN G.STUDENT_STATUS = 'LEV' THEN G.INPUT_DATE ELSE '' END AS "levDay" #휴학생인 경우 휴학일
        FROM STUDENT_BASIC_INFO A         
        LEFT OUTER JOIN COMMON_CODE D ON D.SUPER_CODE = 'GENDER' AND D.CODE = A.GENDER
        LEFT OUTER JOIN COMMON_CODE E ON E.SUPER_CODE = 'BIRTH_PLACE_CD' AND E.CODE = A.BIRTH_PLACE 
        LEFT OUTER JOIN STUDENT_HISTORY G ON A.STUDENT_ID = G.STUDENT_ID AND A.LAST_HISTORY_SEQ = G.HISTORY_SEQ
        LEFT OUTER JOIN COMMON_CODE C1  ON C1.SUPER_CODE = 'STUDENT_STATUS' AND C1.CODE = G.STUDENT_STATUS  
        WHERE A.STUDENT_ID = ${req.query.studentId}`;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/oldstudent/view/basic failed. sql=${sql}, error=${err}`);
                res.send({"basicInfo": {}});    
            }else{
                Log.print(`/api/oldstudent/view/basic called. sql=${sql} STUDENT_ID=${req.query.studentId}`);
                if(rows && rows.length == 1){
                    res.send({"basicInfo": rows[0]});    
                }        
            }
        }
    );
}//viewBasicInfo

/**
 * 휴학, 졸업생 가족정보 상세보기
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
                Log.error(`/api/oldstudent/view/family failed. sql=${sql}, error=${err}`);
                res.send({"familyInfo": {}});    
            }else{
                Log.print(`/api/oldstudent/view/family called. sql=${sql} STUDENT_ID=${req.query.studentId}`);    
                if(rows && rows.length == 1){
                    res.send({"familyInfo": rows[0]});    
                }        
            }
        }
    );
}//viewFamilyInfo

module.exports = {
    viewBasicInfo,
    viewFamilyInfo
}