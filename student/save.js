const Log = require('../utils/debug.js');

/**
 * 학생정보 입력화면에서 사용가능한 일련번호 목록 조회
 */
const validSeqList = (req, res, connection) => { 
    
    let year = req.query.year;
    let dpt = req.query.dpt;
    let currentStudentNo = req.query.currentStudentNo;

    if(!year || !dpt){        
        Log.error(`/api/student/validseq/list failed. 파라미터 부재 year=${year}, dpt=${dpt}`);
        res.send({"seqList": [] });
        return;
    }

    let sql = `
    SELECT SEQ_STR AS "seq"
    FROM DUMMY_SEQ
    WHERE 1=1
    AND SEQ NOT IN (SELECT SEQ
                      FROM (SELECT SUBSTRING(STUDENT_NO,1,2) AS YEAR
                                 , SUBSTRING(STUDENT_NO, 3,1) AS DPT
                                 , CONVERT(SUBSTRING(STUDENT_NO,4,6), UNSIGNED) AS SEQ    
                              FROM STUDENT_BASIC_INFO 
                              WHERE 1=1
    `;
    
    if(!!currentStudentNo) {
        sql += ` AND STUDENT_NO != '${currentStudentNo}'  `;
    }

    sql += `                          
                            ) A
                     WHERE 1=1
                       AND YEAR = '${year}'
                       AND DPT = '${dpt}'
    )   `;    

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/validseq/list failed. sql=${sql} err=${err}`);
                res.send({"seqList": []});
            }else{           
                let seqList = [];
                for(let i=0; i < rows.length; i++){
                    seqList.push(rows[i]);
                }
                Log.print(`/api/student/validseq/list called. sql=${sql}`);
                res.send({"seqList": seqList});
            }
        }
    );
}

/**
 * 학생 기본정보 STUDENT_BASIC_INFO insert
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveBasicInfo(req, res, connection)  { 
    if(!req.body.studentId){
        throw new Error("학생기본정보 실패 : Student ID is null.");
    }

    //기본정보 저장    
    let sql = `
    INSERT INTO STUDENT_BASIC_INFO (
        STUDENT_ID,
        STUDENT_NO,
        KOREAN_NAME,
        GERMAN_NAME,
        BIRTHDAY,
        MOBILE_NO,
        GENDER,
        BIRTH_PLACE,
        PLZ,
        ADDRESS_CITY,
        ADDRESS_DTL,
        ENTRANCE_DAY,
        EMAIL,
        USE_YN,
        CRE_ID,
        CRE_DTM,
        LAST_HISTORY_SEQ        
    ) VALUES (
         ${req.body.studentId} ,
        '${req.body.studentNo}' ,
        '${req.body.koreanName}' ,
        '${req.body.germanName}' ,
        '${req.body.birthday}' ,
        '${req.body.mobileNo}' ,
        '${req.body.gender}' ,
        '${req.body.birthPlace}' ,
        '${req.body.plz}' ,
        '${req.body.addressCity}' ,
        '${req.body.addressDtl}',
        '${req.body.entranceDay}',
        '${req.body.email}',
        'Y' ,
        '${req.body.creId}' ,
        NOW(),
        0
    )`;

    //기본정보 저장
    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => {            
            if(err) {
                Log.error(`/api/student/save failed. 기본정보저장 실패 sql=${sql}, err=${err}`); 
                return false;
            }else{
                Log.print(`/api/student/save called. 기본정보저장 성공 sql=${sql}`);    
                return true;
            }
        }
    );
}//saveBasicInfo

/**
 * 학생가족정보 저장 STUDENT_FAMILY insert
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveFamilyInfo(req, res, connection){

    if(!req.body.studentId){
        throw new Error("학생가족정보 실패 : Student ID is null.");
    }

    let sql = `
    INSERT INTO STUDENT_FAMILY (
        STUDENT_ID,
        FATHER_NAME,
        MOTHER_NAME,
        FATHER_NAME_ENG,
        MOTHER_NAME_ENG,
        REPRESENT_YN,
        FATHER_PHONE_NO,
        MOTHER_PHONE_NO,
        BANK,
        ACCOUNT_NO,
        ACCOUNT_HOLDER,
        IBAN,
        BIC,
        USE_YN,
        CRE_ID,
        CRE_DTM
    ) VALUES (
         ${req.body.studentId} ,
        '${req.body.fatherName}',
        '${req.body.motherName}',
        '${req.body.fatherNameEng}',
        '${req.body.motherNameEng}',
        '${req.body.representYn}' ,
        '${req.body.fatherPhoneNo}' ,
        '${req.body.motherPhoneNo}' ,
        '${req.body.bank}' ,
        '${req.body.accountNo}' ,
        '${req.body.accountHolder}' ,
        '${req.body.iban}' ,
        '${req.body.bic}' ,
        'Y' ,
        '${req.body.creId}' ,
        NOW() 
    )`;

    params = [];
    connection.query(sql, params, 
        (err, rows, fields) => {            
            if(err) {
                Log.error(`/api/student/save failed. 가족정보저장 실패 sql=${sql}, err=${err}`);  
                return false;
            } else {       
                Log.print(`/api/student/save called. 가족정보저장 성공 sql=${sql}`);  
                return true;
            }
        }
    );
}//saveFamilyInfo

/**
 * 학생이력정보 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveStudentHistory(req, res, connection){

    if(!req.body.studentId){
        throw new Error("학생가족정보 실패 : Student ID is null.");
    }

    let sql = `
    INSERT INTO STUDENT_HISTORY (
        STUDENT_ID,
        HISTORY_SEQ,
        STUDENT_STATUS,
        INPUT_DATE,
        CRE_ID,
        CRE_DTM
    ) VALUES (
         ${req.body.studentId} ,
         0 ,
        'STD',
        '${req.body.entranceDay}',
        '${req.body.creId}' ,
        NOW() 
    )`;

    params = [];
    connection.query(sql, params, 
        (err, rows, fields) => {            
            if(err) {
                Log.error(`/api/student/save failed. 학생이력정보 실패 sql=${sql}, err=${err}`);  
                return false;
            }else {              
                Log.print(`/api/student/save called. 학생이력정보 성공 sql=${sql}`);   
                return true;
            } 
        }
    );
}//saveStudentHistory

/**
 * 학생정보 저장 - studentID 조회, 기본정보 저장, 가족정보 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function studentSave (req, res, connection)  { 

     //유효한 PK를 조회한다.
    let sql = `SELECT CASE WHEN STUDENT_ID IS NULL THEN 0 ELSE CAST(MAX(STUDENT_ID)+1 AS CHAR) END AS "nextId"
                 FROM STUDENT_BASIC_INFO  `;
    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/student/save called. PK 추출 sql=${sql}, err=${err}`);
                res.send({result:'failed', msg:err});
                throw err;
           }
           if(!!rows || rows.length > 0){    
                Log.print(`/api/student/save called. 학생정보 저장을 위해 추출한  studenId=${rows[0].nextId}`);
                
                try {          
                    req.body.studentId = rows[0].nextId; 
                    if(!req.body.studentId){
                        throw new Error('학생정보 저장을 위한 학생아이다 student_id 생성 실패');
                    }     
                    saveBasicInfo(req, res, connection);
                    saveFamilyInfo(req, res, connection);
                    saveStudentHistory(req, res, connection); 
                    res.json({result:'success', msg:'학생정보를 저장하였습니다.', studentId:req.body.studentId });
                } catch (error) {  
                    Log.error(`/api/student/save failed. error=${error}`);
                }
           }
           
        }
    );    
}//studentSave

module.exports = {
    validSeqList,
    studentSave  //학생정보 저장
}
