const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 재학증명서 출력
 */
copyEnrollmentContents = async (documentInfo, editable, issued, targetFile) => {
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
            worksheet.getCell('A1').value  = Utils.findItemValue(documentInfo, 'schoolNameGr');
            worksheet.getCell('A2').value  = Utils.findItemValue(documentInfo, 'address');
            worksheet.getCell('A3').value  = Utils.findItemValue(documentInfo, 'Vorstandsvorsitzender');
            worksheet.getCell('A4').value  = Utils.findItemValue(documentInfo, 'Schuldirektorin');
            worksheet.getCell('A5').value  = Utils.findItemValue(documentInfo, 'Sitz');
            worksheet.getCell('A6').value  = Utils.findItemValue(documentInfo, 'Amtsgericht');
            worksheet.getCell('A7').value = Utils.findItemValue(documentInfo, 'Tel');
            worksheet.getCell('A8').value = Utils.findItemValue(documentInfo, 'Email');
            worksheet.getCell('A9').value = Utils.findItemValue(documentInfo, 'Homepage');
            worksheet.getCell('A10').value = Utils.findItemValue(documentInfo, 'Bank');
            worksheet.getCell('A11').value = Utils.findItemValue(documentInfo, 'IBAN');
            worksheet.getCell('A12').value = Utils.findItemValue(documentInfo, 'BIC');
            
            worksheet.getCell('B1').value = editable.comment;
            worksheet.getCell('B2').value = Utils.convertGermanStyleDate(issued.issuedDate);
            worksheet.getCell('B3').value = Utils.getDocuNo(issued);
            worksheet.getCell('B4').value = editable.applicant;            
            worksheet.getCell('B5').value = editable.addressDtl;
            worksheet.getCell('B6').value = editable.plz + ' ' + editable.addressCity; 
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/enrollment failed error=${error}`);        
    }
}

/**
 * 재학증명서
 */
makeEnrollmentExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/enrollment called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.studentNo + editable.koreanName;   
        let objectFile = `${excelConf.excelDir}${excelConf.enrollmentDir}${fileName}_재학증명서${excelConf.enrollmentExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.enrollment}`, objectFile);
        await copyEnrollmentContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.studentId, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/enrollment failed error=${error}`);   
        res.send({"result": "failed"});
     }
}//makeEnrollmentExcel

var DOCUMENT_ENROLLMENT;
getDocumnetInfo = () => {
    return DOCUMENT_ENROLLMENT;
}
setDocumnetInfo = (documentInfo) => {
    DOCUMENT_ENROLLMENT = documentInfo;
}

var ISSUED_ENROLLMENT;
getIssued = () => {
    return ISSUED_ENROLLMENT;
}
setIssued = (issued) => {
    ISSUED_ENROLLMENT = issued;
}

var EDITABLE_ENROLLMENT;
getEditable = () => {
    return EDITABLE_ENROLLMENT;
}
setEditable = (editable) => {
    EDITABLE_ENROLLMENT= editable;
}

module.exports = {
    makeEnrollmentExcel
}