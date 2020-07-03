const Log = require('../utils/debug.js');


/**
 * 학부모대표 목록
 */
representList = (req, res, connection) => { 

    let sql = `
    SELECT A.KOREAN_NAME AS "studentName", 
            A.EMAIL AS "email", 
            B.FATHER_NAME AS "fatherName", 
            B.FATHER_PHONE_NO AS "fatherPhoneNo", 
            B.MOTHER_NAME AS "motherName", 
            B.MOTHER_PHONE_NO AS "motherPhoneNo", 
            CONCAT(C1.CODE_NAME, ' ', C.CLASS_NAME) AS "className",
            D.TEACHER_NAME AS "teacher"
    FROM STUDENT_BASIC_INFO A
    LEFT OUTER JOIN STUDENT_FAMILY B ON A.STUDENT_ID = B.STUDENT_ID
    LEFT OUTER JOIN CLASS_INFO C ON A.LAST_CLASS_ID = C.CLASS_ID
    LEFT OUTER JOIN COMMON_CODE C1 ON C.DEPARTMENT = C1.CODE AND C1.SUPER_CODE = 'DEPARTMENT'
    LEFT OUTER JOIN TEACHER D ON C.TEACHER_ID = D.TEACHER_ID
    WHERE 1=1
    AND B.REPRESENT_YN = 'Y'
    ORDER BY C1.CODE_NAME, C.CLASS_NAME
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/represent/list failed . sql=${sql} error=${err}`);
                res.send({"results": []});
            }else{            
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/represent/list called . sql=${sql} count=${rows.length}`);
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
 * 학부모대료 엑셀변환
 */
representListExcel = async (req, res) => {
    try {
        let results = JSON.parse(req.body.results);
        let represents = `${excelConf.excelDir}${excelConf.representDir}학부모대표${excelConf.representExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.represent}`, represents);
        await makeRepresents(results, represents);
        res.send({"result": "success"});
     } catch (err) {
        Log.error(`/api/represent/list failed . sql=${sql} error=${err}`);
        res.send({"result": "failed"});
     }
}//representListExcel

var REPRESENTS;
getRepresents = () => {
    return REPRESENTS;
}
setRepresents = (results) => {
    REPRESENTS = results;
}

/**
 * 엑셀 파일에 실재로 쓰기
 */
makeRepresents = async (results, targetFile) => {    
    try {
        setRepresents(results);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(function() {
            let worksheet = workbook.getWorksheet('data');
            results = getRepresents();
            const MAX_STUDENTS = 35;
            for(let i=0; i<results.length; i++){
                let index = i + 1;
                let result = results[i];
                worksheet.getCell(`A${index}`).value = result.teacher;
                worksheet.getCell(`B${index}`).value = result.className;
                worksheet.getCell(`C${index}`).value = result.studentName;
                worksheet.getCell(`D${index}`).value = result.email;
                worksheet.getCell(`E${index}`).value = result.fatherName;
                worksheet.getCell(`F${index}`).value = result.fatherPhoneNo;
                worksheet.getCell(`G${index}`).value = result.motherName;
                worksheet.getCell(`H${index}`).value = result.motherPhoneNo;
            }//for            
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/represent/list failed. error=${error}`);
    }
}//makeRepresents

module.exports = {
    representList, //학부모대표
    representListExcel //학부모대표 엑셀변환
}