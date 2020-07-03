const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

//학생목록 조회
allstudentsList = (req, res, connection) => { 

        let sql = `
        SELECT  A.STUDENT_ID "studentId",
                A.STUDENT_NO "studentNo",
                A.KOREAN_NAME AS "studentName",
                A.GERMAN_NAME AS "germanName",
                IFNULL(CONCAT(C1.CODE_NAME, ' ', C.CLASS_NAME), '') AS "className",
                IFNULL(D.TEACHER_NAME, '') AS "teacher",
                A.BIRTHDAY AS "birthday",
                A.ENTRANCE_DAY AS "entranceDay",
                C2.CODE_NAME AS "studentStatus",
                IFNULL(A.GRADUATE_DAY,'') AS "graduateDay",
                C3.CODE_NAME AS "gender",
                C4.CODE_NAME AS "birthPlace",
                A.EMAIL AS "email",
                A.MOBILE_NO AS "mobileNo",
                A.PLZ AS "plz",
                A.ADDRESS_DTL AS "addressDtl",
                A.ADDRESS_CITY AS "addressCity",
                B.FATHER_NAME AS "fatherName",
                IFNULL(B.FATHER_NAME_ENG, '') AS "fatherNameEng",
                B.FATHER_PHONE_NO AS "fatherPhoneNo",
                B.MOTHER_NAME AS "motherName",
                IFNULL(B.MOTHER_NAME_ENG, '') AS "motherNameEng",
                B.MOTHER_PHONE_NO AS "motherPhoneNo",
                B.REPRESENT_YN AS "representYn",
                IFNULL(C5.CODE_NAME, '') AS "bank",
                B.ACCOUNT_NO AS "accountNo",
                B.ACCOUNT_HOLDER AS "accountHolder",
                B.IBAN AS "iban",
                B.BIC AS "bic"
        FROM STUDENT_BASIC_INFO A
        LEFT OUTER JOIN STUDENT_FAMILY B ON A.STUDENT_ID = B.STUDENT_ID
        LEFT OUTER JOIN CLASS_INFO C ON A.LAST_CLASS_ID = C.CLASS_ID
        LEFT OUTER JOIN TEACHER D ON C.TEACHER_ID = D.TEACHER_ID
        LEFT OUTER JOIN STUDENT_HISTORY E ON A.STUDENT_ID = E.STUDENT_ID AND A.LAST_HISTORY_SEQ = E.HISTORY_SEQ

        LEFT OUTER JOIN COMMON_CODE C1 ON C.DEPARTMENT = C1.CODE AND C1.SUPER_CODE = 'DEPARTMENT'
        LEFT OUTER JOIN COMMON_CODE C2 ON E.STUDENT_STATUS = C2.CODE AND C2.SUPER_CODE = 'STUDENT_STATUS'
        LEFT OUTER JOIN COMMON_CODE C3 ON A.GENDER = C3.CODE AND C3.SUPER_CODE = 'GENDER'
        LEFT OUTER JOIN COMMON_CODE C4 ON A.BIRTH_PLACE = C4.CODE AND C4.SUPER_CODE = 'BIRTH_PLACE_CD'
        LEFT OUTER JOIN COMMON_CODE C5 ON B.BANK = C5.CODE AND C5.SUPER_CODE = 'BANK_CD'

        WHERE 1=1
        AND E.STUDENT_STATUS = 'STD'
        ORDER BY A.STUDENT_NO
    `;    

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/allstudents/list failed . sql=${sql} error=${err}`);
                res.send({"results": []});
            }else{              
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/allstudents/list called . sql=${sql} count=${rows.length}`);
                res.send({"results": results});
            }
        }
    );
};

const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');

/**
 * 전체 학생
 */
allstudentsListExcel = async (req, res) => {
    try {
        let results = JSON.parse(req.body.results);
        let allstudents = `${excelConf.excelDir}${excelConf.allstudentsDir}전체학생${excelConf.allstudentsExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.allstudents}`, allstudents);
        await makeAllstudents(results, allstudents);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/allstudents/list failed error=${error}`);
        res.send({"result": "failed"});
     }
}//allstudentsListExcel


var ALLSTUDENTS;
getAllstudents = () => {
    return ALLSTUDENTS;
}
setAllstudents = (results) => {
    ALLSTUDENTS = results;
}

/**
 * 엑셀변환
 */
makeAllstudents = async (results, targetFile) => {    
    try {
        setAllstudents(results);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(function() {
            let worksheet = workbook.getWorksheet('data');
            results = getAllstudents();

            for(let i=0; i<results.length; i++){
                let index = i + 1;
                let result = results[i];
                worksheet.getCell(`A${index}`).value = result.studentId;
                worksheet.getCell(`B${index}`).value = result.studentNo;
                worksheet.getCell(`C${index}`).value = result.studentName;
                worksheet.getCell(`D${index}`).value = result.germanName;

                worksheet.getCell(`E${index}`).value = result.className;
                worksheet.getCell(`F${index}`).value = result.teacher;
                worksheet.getCell(`G${index}`).value = Utils.convertDate(result.birthday, '-');
                worksheet.getCell(`H${index}`).value = Utils.convertDate(result.entranceDay, '-');
                worksheet.getCell(`I${index}`).value = result.studentStatus;
                worksheet.getCell(`J${index}`).value = Utils.convertDate(result.graduateDay, '-');
                worksheet.getCell(`K${index}`).value = result.gender;
                worksheet.getCell(`L${index}`).value = result.birthPlace;
                worksheet.getCell(`M${index}`).value = result.email;

                worksheet.getCell(`N${index}`).value = result.mobileNo;
                worksheet.getCell(`O${index}`).value = result.plz;
                worksheet.getCell(`P${index}`).value = result.addressDtl;

                worksheet.getCell(`Q${index}`).value = result.addressCity;
                worksheet.getCell(`R${index}`).value = result.fatherName;
                worksheet.getCell(`S${index}`).value = result.fatherNameEng;
                worksheet.getCell(`T${index}`).value = result.fatherPhoneNo;

                worksheet.getCell(`U${index}`).value = result.motherName;
                worksheet.getCell(`V${index}`).value = result.motherNameEng;
                worksheet.getCell(`W${index}`).value = result.motherPhoneNo;
                worksheet.getCell(`X${index}`).value = result.representYn;

                worksheet.getCell(`Y${index}`).value = result.bank;
                worksheet.getCell(`Z${index}`).value = result.accountNo;                
                worksheet.getCell(`AA${index}`).value = result.accountHolder;

                worksheet.getCell(`AB${index}`).value = result.iban;
                worksheet.getCell(`AC${index}`).value = result.bic;               
                
            }//for            
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/allstudents/list failed error=${error}`);
    }
}//makeRepresents

module.exports = {
    allstudentsList,
    allstudentsListExcel
}