const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 정근상장 출력
 */
copyRegularContents = async (documentInfo, editable, issued, targetFile) => {
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
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/regular failed error=${error}`);        
    }
}

/**
 * 정근상장
 */
makeRegularExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/regular called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.studentNo + editable.koreanName;   
        let objectFile = `${excelConf.excelDir}${excelConf.regularDir}${fileName}_정근상장${excelConf.regularExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.regular}`, objectFile);
        await copyRegularContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.studentId, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/regular failed error=${error}`);   
        res.send({"result": "failed"});
     }
}//makeRegularExcel

var DOCUMENT_REGULA;
getDocumnetInfo = () => {
    return DOCUMENT_REGULA;
}
setDocumnetInfo = (documentInfo) => {
    DOCUMENT_REGULA = documentInfo;
}

var ISSUED_REGULA;
getIssued = () => {
    return ISSUED_REGULA;
}
setIssued = (issued) => {
    ISSUED_REGULA = issued;
}

var EDITABLE_REGULA;
getEditable = () => {
    return EDITABLE_REGULA;
}
setEditable = (editable) => {
    EDITABLE_REGULA = editable;
}

module.exports = {
    makeRegularExcel
}