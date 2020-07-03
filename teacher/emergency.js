const Log = require('../utils/debug.js');

/**
 * 비상연락망 목록 조회
 */
emergencyList = (req, res, connection) => { 

    let sql = `
    SELECT TEACHER_NO AS "teacherNo",
           TEACHER_NAME AS "teacherName",
           EMAIL AS "email",
           MOBILE_NO AS "mobileNo"
    FROM TEACHER
    ORDER BY TEACHER_NAME
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/emergency/list failed . sql=${sql} err=${err}`);
                throw err;
            }else{ 
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/emergency/list called . sql=${sql} count=${rows.length}`);
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
 * 비상연락망 템플릿 복사 및 파일 생성
 */
emergencyListExcel = async (req, res) => {
    try {
        let results = JSON.parse(req.body.results);
        let emergencys = `${excelConf.excelDir}${excelConf.emergencyDir}교사비상연락망${excelConf.emergencyExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.emergency}`, emergencys);
        await makeEmergencyListExcel(results, emergencys);
        res.send({"result": "success"});
     } catch (err) {
        Log.error(`/api/emergency/list failed. err=${err}`);
        res.send({"result": "failed"});
     }
}//emergencyListExcel

var EMERGENCY;
getEmergency = () => {
    return EMERGENCY;
}
setEmergency = (results) => {
    EMERGENCY = results;
}

/**
 * 비상연락망 파일에 데이터 쓰기
 */
makeEmergencyListExcel = async (results, targetFile) => {    
    try {
        setEmergency(results);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(function() {
            let worksheet = workbook.getWorksheet('data');
            results = getEmergency();
            let data = new Date();
            worksheet.getCell(`E1`).value = `${data.getFullYear()}학년도 교사비상연락망`;

            for(let i=0; i<results.length; i++){
                let index = i + 1;
                let result = results[i];
                worksheet.getCell(`A${index}`).value = result.teacherNo;
                worksheet.getCell(`B${index}`).value = result.teacherName;
                worksheet.getCell(`C${index}`).value = result.email;
                worksheet.getCell(`D${index}`).value = result.mobileNo;
            }//for            
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/emergency/list failed error=${error}`);
    }
}//makeRepresents

module.exports = {
    emergencyList,
    emergencyListExcel
}