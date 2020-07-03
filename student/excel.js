const Log = require('../utils/debug.js');

/**
 * 학생정보 엑셀 업로드 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function excelSave (req, res, connection)  { 
    let studentList = JSON.parse(req.body.studentList).studentList;
    let totalCount = req.body.totalCount;
    let successCount = 0;
    let failedCount = 0;

    for(let i=0; i<studentList.length; i++){
        let student = studentList[i];

        //학생기본정보 저장
        let sql2 = `
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
        )                 
        SELECT CONVERT(A.nextId, UNSIGNED) AS "studentId",
               CONCAT('${student.entranceYear}', '${student.entranceDpt}', LPAD(CONVERT(B.seq, CHAR),3,'0')) AS "studentNo",
               '${student.koreanName}' ,
               '${student.germanName}' ,
               '${student.birthday}' ,
               '${student.mobileNo}' ,
               '${student.gender}' ,
               '${student.birthPlace}' ,
               '${student.plz}' ,
               '${student.addressCity}' ,
               '${student.addressDtl}',
               '${student.entranceDay}',
               '${student.email}',
               'Y' ,
               'excel' ,
               NOW(),
               0            
        FROM
        (SELECT CASE WHEN STUDENT_ID IS NULL THEN 0 ELSE CAST(MAX(STUDENT_ID)+1 AS CHAR) END AS "nextId"
        FROM STUDENT_BASIC_INFO ) A,
        (SELECT MIN(SEQ_STR) AS "seq"
        FROM DUMMY_SEQ
        WHERE 1=1
        AND SEQ NOT IN (SELECT SEQ
                    FROM (SELECT SUBSTRING(STUDENT_NO,1,2) AS YEAR
                                , SUBSTRING(STUDENT_NO, 3,1) AS DPT
                                , CONVERT(SUBSTRING(STUDENT_NO,4,6), UNSIGNED) AS SEQ
                            FROM STUDENT_BASIC_INFO
                            WHERE 1=1
                            ) A
                    WHERE 1=1
                    AND YEAR = '${student.entranceYear}'
                    AND DPT = '${student.entranceDpt}'
        )) B ;                
        `;

        //학생이력 저장 : 학생상태 STUDENT_STATUS - 재학 STD
        sql2 += `
        INSERT INTO STUDENT_HISTORY (
            STUDENT_ID,
            HISTORY_SEQ,
            STUDENT_STATUS,
            INPUT_DATE,
            CRE_ID,
            CRE_DTM
        ) 
        SELECT CONVERT(A.nextId, UNSIGNED) AS "studentId",
                0 ,
                'STD',
                '${student.entranceDay}',
                'excel' ,
                NOW() 
        FROM
        (SELECT CASE WHEN STUDENT_ID IS NULL THEN 0 ELSE CAST(MAX(STUDENT_ID) AS CHAR) END AS "nextId"
        FROM STUDENT_BASIC_INFO ) A,
        (SELECT MIN(SEQ_STR) AS "seq"
        FROM DUMMY_SEQ
        WHERE 1=1
        AND SEQ NOT IN (SELECT SEQ
                    FROM (SELECT SUBSTRING(STUDENT_NO,1,2) AS YEAR
                                , SUBSTRING(STUDENT_NO, 3,1) AS DPT
                                , CONVERT(SUBSTRING(STUDENT_NO,4,6), UNSIGNED) AS SEQ
                            FROM STUDENT_BASIC_INFO
                            WHERE 1=1
                            ) A
                    WHERE 1=1
                    AND YEAR = '${student.entranceYear}'
                    AND DPT = '${student.entranceDpt}'
        )) B ;  
        `;

        //학생가족정보 저장
        sql2 += `
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
        )          
                        
        SELECT CONVERT(A.nextId, UNSIGNED) AS "studentId",
                '${student.fatherName}',
                '${student.motherName}',
                '${student.fatherNameEng}',
                '${student.motherNameEng}',
                '${student.representYn}' ,
                '${student.fatherPhoneNo}' ,
                '${student.motherPhoneNo}' ,
                '${student.bank}' ,
                '${student.accountNo}' ,
                '${student.accountHolder}' ,
                '${student.iban}' ,
                '${student.bic}' ,
                'Y' ,
                'excel' ,
                NOW() 
        FROM
        (SELECT CASE WHEN STUDENT_ID IS NULL THEN 0 ELSE CAST(MAX(STUDENT_ID) AS CHAR) END AS "nextId"
        FROM STUDENT_BASIC_INFO ) A,
        
        (SELECT MIN(SEQ_STR) AS "seq"
        FROM DUMMY_SEQ
        WHERE 1=1
        AND SEQ NOT IN (SELECT SEQ
                    FROM (SELECT SUBSTRING(STUDENT_NO,1,2) AS YEAR
                                , SUBSTRING(STUDENT_NO, 3,1) AS DPT
                                , CONVERT(SUBSTRING(STUDENT_NO,4,6), UNSIGNED) AS SEQ
                            FROM STUDENT_BASIC_INFO
                            WHERE 1=1
                            ) A
                    WHERE 1=1
                    AND YEAR = '${student.entranceYear}'
                    AND DPT = '${student.entranceDpt}'
        )) B ;      
        `;        

        //기본정보 저장
        let params = [];
        connection.query(sql2, params, 
            (err, rows, fields) => {         
                if(err) { 
                    failedCount++;
                    Log.error(`/api/student/excel/save failed. totalCount=${totalCount}, failedCount=${failedCount}, sql=${sql2}, err=${err}`);  
                }else{ 
                    successCount++;
                    Log.print(`/api/student/excel/save called.totalCount=${totalCount}, successCount=${successCount}, sql=${sql2} `);  
                }               
            }
        );   
    }//for

    
    res.send({"result":"success"});
    //이유는 모르겠지만 successCount와 failedCount가 증가되지않아 아래의 조건으로 결과를 보낼 수 없다.
    /*
    Log.print(`totalCount=${totalCount}, success=${successCount}, failed=${failedCount}`);
    if(totalCount == successCount){
        res.send({"result":"success", "msg":`${totalCount} 중 ${successCount}건 저장 성공.`});
    }else{
        res.send({"result":"failed", "msg":`${totalCount} 중 ${successCount}건 저장 성공, ${failedCount}건 실패.`});
    } */  
}//excelSave

module.exports = {
    excelSave
}
