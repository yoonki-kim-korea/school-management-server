const Log = require('../utils/debug.js');

/**
 * 학생정보 중 기본정보 수정
 */
updateStudentBasicInfo = (req, res, connection) => { 

    let sql = `
    UPDATE STUDENT_BASIC_INFO 
    SET STUDENT_NO     = '${req.body.studentNo}', 
        KOREAN_NAME    = '${req.body.koreanName}',
        GERMAN_NAME    = '${req.body.germanName}',
        BIRTHDAY       = '${req.body.birthday}',
        ENTRANCE_DAY   = '${req.body.entranceDay}',
        GENDER         = '${req.body.gender}',
        BIRTH_PLACE    = '${req.body.birthPlace}',
        EMAIL          = '${req.body.email}',
        MOBILE_NO      = '${req.body.mobileNo}',
        PLZ            = '${req.body.plz}',
        ADDRESS_CITY   = '${req.body.addressCity}',
        ADDRESS_DTL    = '${req.body.addressDtl}',
        UDT_ID         =  '${req.body.updId}',
        UDT_DTM        = NOW()        
    WHERE STUDENT_ID = ${req.body.studentId}   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/basic/update failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/student/basic/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

/**
 * 학생정보 중 가족정보 수정
 */
updateStudentFamily = (req, res, connection) => { 
    let sql = `
    UPDATE STUDENT_FAMILY 
    SET FATHER_NAME     = '${req.body.fatherName}' ,
        MOTHER_NAME     = '${req.body.motherName}' ,
        FATHER_NAME_ENG = '${req.body.fatherNameEng}' ,
        MOTHER_NAME_ENG = '${req.body.motherNameEng}' ,
        REPRESENT_YN    = '${req.body.representYn}' ,
        FATHER_PHONE_NO = '${req.body.fatherPhoneNo}' ,
        MOTHER_PHONE_NO = '${req.body.motherPhoneNo}' ,
        BANK            = '${req.body.bank}' ,
        IBAN            = '${req.body.iban}' ,
        BIC             = '${req.body.bic}' ,
        ACCOUNT_NO      = '${req.body.accountNo}' ,
        ACCOUNT_HOLDER  = '${req.body.accountHolder}' ,
        UDT_ID          = '${req.body.updId}',
        UDT_DTM         = NOW()        
  WHERE STUDENT_ID = ${req.body.studentId}  
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/family/update failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/student/family/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

/**
 * 학부모 이름만 수정
 */
updateStudentParentsName = (req, res, connection) => { 
    let sql = `
    UPDATE STUDENT_FAMILY 
    SET FATHER_NAME = '${req.body.fatherName}' ,
        MOTHER_NAME = '${req.body.motherName}' ,
        FATHER_NAME_ENG = '${req.body.fatherNameEng}' ,
        MOTHER_NAME_ENG = '${req.body.motherNameEng}' ,
        UDT_ID =  '${req.body.updId}',
        UDT_DTM = NOW()        
  WHERE STUDENT_ID = ${req.body.studentId}  
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/parents/name/update failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/student/parents/name/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

/**
 * 학생기본정보의 입학금 저장
 */
updateStudentBasicInfoAddmission = (req, res, connection) => { 
    
    let sql = `
    UPDATE STUDENT_BASIC_INFO 
    SET ADMISSION_FEE  = '${req.body.admission}',
        UDT_ID =  '${req.body.updId}',
        UDT_DTM = NOW()        
    WHERE STUDENT_ID = ${req.body.studentId}   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/admission/update failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/student/admissionadmission/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    updateStudentBasicInfo,
    updateStudentFamily,
    updateStudentParentsName,
    updateStudentBasicInfoAddmission
}
