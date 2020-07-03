const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 졸업장 출력
 */
copyGraduateContents = async (documentInfo, editable, issued, targetFile) => {
    try {     
        setDocumnetInfo(documentInfo);
        setIssued(issued);
        setEditable(editable);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(() => {
            const delimiter = '-';
            let worksheet = workbook.getWorksheet('data');
            let documentInfo = getDocumnetInfo();
            let issued = getIssued();
            let editable = getEditable();
            worksheet.getCell('A1').value = '제 ' + issued.issuedYear + '-' + issued.documentType + '-' + issued.seqNo + ' 호';
            worksheet.getCell('A2').value = editable.koreanName;
            worksheet.getCell('A3').value = Utils.convertKoreanStyleDate(editable.birthday);
            worksheet.getCell('A4').value = editable.departmentName;
            worksheet.getCell('A5').value = editable.comment;
            worksheet.getCell('A7').value = Utils.convertKoreanStyleDate(issued.issuedDate);
            worksheet.getCell('A8').value = Utils.findItemValue(documentInfo, 'bottom');
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/graduate failed error=${error}`);        
    }
}

/**
 * 졸업장
 */
makeGraduateExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/graduate called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.studentNo + editable.koreanName;   
        let objectFile = `${excelConf.excelDir}${excelConf.graduateDir}${fileName}_졸업장${excelConf.graduateExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.graduate}`, objectFile);
        await copyGraduateContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.studentId, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/graduate failed error=${error}`);    
        res.send({"result": "failed"});
     }
}//makeGraduateExcel

var DOCUMENT_GRADUATE;
getDocumnetInfo = () => {
    return DOCUMENT_GRADUATE;
}
setDocumnetInfo = (documentInfo) => {
    DOCUMENT_GRADUATE = documentInfo;
}

var ISSUED_GRADUATE;
getIssued = () => {
    return ISSUED_GRADUATE;
}
setIssued = (issued) => {
    ISSUED_GRADUATE = issued;
}

var EDITABLE_GRADUATE;
getEditable = () => {
    return EDITABLE_GRADUATE;
}
setEditable = (editable) => {
    EDITABLE_GRADUATE = editable;
}

module.exports = {
    makeGraduateExcel
}