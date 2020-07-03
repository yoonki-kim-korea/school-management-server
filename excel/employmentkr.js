const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 재직증명서(한글) 출력
 */
copyEmploymentKrContents = async (documentInfo, editable, issued, targetFile) => {
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
            worksheet.getCell('A2').value = Utils.findItemValue(documentInfo, 'schoolNameKr');
            worksheet.getCell('A3').value = Utils.findItemValue(documentInfo, 'address');
            worksheet.getCell('A4').value = Utils.findItemValue(documentInfo, 'Vorstandsvorsitzender');
            worksheet.getCell('A5').value = Utils.findItemValue(documentInfo, 'Schuldirektorin');
            worksheet.getCell('A6').value = Utils.findItemValue(documentInfo, 'Sitz');
            worksheet.getCell('A7').value = Utils.findItemValue(documentInfo, 'Amtsgericht');
            worksheet.getCell('A8').value = Utils.findItemValue(documentInfo, 'Tel');
            worksheet.getCell('A9').value = Utils.findItemValue(documentInfo, 'Email');
            worksheet.getCell('A10').value = Utils.findItemValue(documentInfo, 'Homepage');
            worksheet.getCell('A11').value = Utils.findItemValue(documentInfo, 'Bank');
            worksheet.getCell('A12').value = Utils.findItemValue(documentInfo, 'IBAN');
            worksheet.getCell('A13').value = Utils.findItemValue(documentInfo, 'BIC');

            worksheet.getCell('B1').value = editable.teacherEngName;     
            worksheet.getCell('B2').value = editable.addressDtl;     
            worksheet.getCell('B3').value = `${editable.plz} ${editable.addressCity}`;   
            worksheet.getCell('B4').value = editable.teacherName;     
            worksheet.getCell('B5').value = Utils.convertKoreanStyleDate(editable.birthday);   
            worksheet.getCell('B6').value = editable.comment;   
            worksheet.getCell('B7').value = Utils.getDocuNo(issued); 
            worksheet.getCell('B8').value = Utils.findItemValue(documentInfo, 'signatureBlock');
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/employmentkr failed error=${error}`);        
    }
}

/**
 * 재직증명서(한글)
 */
makeEmpolymentKrExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/employmentkr called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.teacherName;   
        let objectFile = `${excelConf.excelDir}${excelConf.employmentKrDir}${fileName}_재직증명서(한글)${excelConf.employmentKrExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.employmentKr}`, objectFile);
        await copyEmploymentKrContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.teacherNo, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/employmentkr failed error=${error}`);     
        res.send({"result": "failed"});
     }
}//makeEmpolymentKrExcel

var DOCUMENT;
getDocumnetInfo = () => {
    return DOCUMENT;
}
setDocumnetInfo = (documentInfo) => {
    DOCUMENT = documentInfo;
}

var ISSUED;
getIssued = () => {
    return ISSUED;
}
setIssued = (issued) => {
    ISSUED = issued;
}

var EDITABLE;
getEditable = () => {
    return EDITABLE;
}
setEditable = (editable) => {
    EDITABLE = editable;
}

module.exports = {
    makeEmpolymentKrExcel
}