const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 개근상장 출력
 */
copyAttendanceContents = async (documentInfo, editable, issued, targetFile) => {
    try {     
        setDocumnetInfo(documentInfo);
        setIssued(issued);
        setEditable(editable);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(() => {
            let worksheet = workbook.getWorksheet('data');
            let documentInfo = getDocumnetInfo();
            let issued = getIssued();
            let editable = getEditable();
            worksheet.getCell('A1').value = '제 ' + issued.issuedYear + '-' + issued.documentType + '-' + issued.seqNo + ' 호';
            worksheet.getCell('A2').value = editable.koreanName;
            worksheet.getCell('A3').value = Utils.convertKoreanStyleDate(editable.birthday);
            worksheet.getCell('A4').value = editable.departmentName;
            worksheet.getCell('A5').value = editable.gradeName;            
            worksheet.getCell('A6').value = editable.comment;
            worksheet.getCell('A7').value = Utils.convertKoreanStyleDate(issued.issuedDate);
            worksheet.getCell('A8').value = Utils.findItemValue(documentInfo, 'bottom');
        })
        .catch(err => {Log.error(`/api/print/excel/attendance failed error=${err}`)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/attendance failed error=${error}`);        
    }
}

/**
 * 개근상장
 */
makeAttendanceExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/attendance called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.studentNo + editable.koreanName;   
        let objectFile = `${excelConf.excelDir}${excelConf.attendanceDir}${fileName}_개근상장${excelConf.attendanceExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.attendance}`, objectFile);
        await copyAttendanceContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.studentId, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/attendance failed error=${error}`);    
        res.send({"result": "failed"});
     }
}//makeEnrollmentExcel

var DOCUMENT_ATTENDANCE;
getDocumnetInfo = () => {
    return DOCUMENT_ATTENDANCE;
}
setDocumnetInfo = (documentInfo) => {
    DOCUMENT_ATTENDANCE = documentInfo;
}

var ISSUED_ATTENDANCE;
getIssued = () => {
    return ISSUED_ATTENDANCE;
}
setIssued = (issued) => {
    ISSUED_ATTENDANCE = issued;
}

var EDITABLE_ATTENDANCE;
getEditable = () => {
    return EDITABLE_ATTENDANCE;
}
setEditable = (editable) => {
    EDITABLE_ATTENDANCE = editable;
}

module.exports = {
    makeAttendanceExcel
}