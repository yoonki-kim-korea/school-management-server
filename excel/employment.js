const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 재직증명서 출력
 */
copyeditableContents = async (documentInfo, editable, issued, targetFile) => {
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
            worksheet.getCell('A7').value  = Utils.findItemValue(documentInfo, 'Tel');
            worksheet.getCell('A8').value  = Utils.findItemValue(documentInfo, 'Email');
            worksheet.getCell('A9').value  = Utils.findItemValue(documentInfo, 'Homepage');
            worksheet.getCell('A10').value = Utils.findItemValue(documentInfo, 'Bank');
            worksheet.getCell('A11').value = Utils.findItemValue(documentInfo, 'IBAN');
            worksheet.getCell('A12').value = Utils.findItemValue(documentInfo, 'BIC');    

            worksheet.getCell('A13').value = editable.teacherEngName;    
            worksheet.getCell('A14').value = editable.addressDtl;    
            worksheet.getCell('A15').value = `${editable.plz} ${editable.addressCity}`;
            worksheet.getCell('A16').value = Utils.findItemValue(documentInfo, 'content1');  
            worksheet.getCell('A17').value = Utils.convertGermanStyleDate(editable.birthday, '.'); 
            worksheet.getCell('A18').value = Utils.findItemValue(documentInfo, 'Vorsitzender');   
            worksheet.getCell('A19').value = editable.title + ' ';      
            worksheet.getCell('A20').value = editable.comment;
        })
        .catch(err => {Log.error(`/api/print/excel/employment failed error=${err}`)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/employment failed error=${error}`);        
    }
}

/**
 * 재직증명서
 */
makeEmpolymentExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/employment called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.teacherName;   
        let objectFile = `${excelConf.excelDir}${excelConf.employmentDir}${fileName}_재직증명서${excelConf.employmentExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.employment}`, objectFile);
        await copyeditableContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.teacherNo, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/employment failed error=${error}`);   
        res.send({"result": "failed"});
     }
}//makeEmpolymentExcel

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
    makeEmpolymentExcel
}