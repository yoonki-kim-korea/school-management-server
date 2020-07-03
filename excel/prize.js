const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 상장 출력
 */
copyPrizeContents = async (documentInfo, editable, issued, targetFile) => {
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
            worksheet.getCell('A2').value = editable.prizeType;
            worksheet.getCell('A3').value = editable.departmentName + ' ' + editable.className;
            worksheet.getCell('A4').value = editable.koreanName;
            worksheet.getCell('A5').value = editable.comment;
            worksheet.getCell('A6').value = issued.issuedDate.substring(0,4) + '년 ' + issued.issuedDate.substring(4,6) + '월 ' + issued.issuedDate.substring(6,8) + '일';
            worksheet.getCell('A7').value = Utils.findItemValue(documentInfo, 'bottom');
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/prize failed error=${error}`);        
    }
}

/**
 * 상장
 */
makePrizeExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/prize called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.studentNo + editable.koreanName;   
        let objectFile = `${excelConf.excelDir}${excelConf.prizeDir}${fileName}_${editable.prizeType}${excelConf.prizeExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.prize}`, objectFile);
        await copyPrizeContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.studentId, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/prize failed error=${error}`);  
        res.send({"result": "failed"});
     }
}//makePrizeExcel

var DOCUMENT_PRIZE;
getDocumnetInfo = () => {
    return DOCUMENT_PRIZE;
}
setDocumnetInfo = (documentInfo) => {
    DOCUMENT_PRIZE = documentInfo;
}

var ISSUED_PRIZE;
getIssued = () => {
    return ISSUED_PRIZE;
}
setIssued = (issued) => {
    ISSUED_PRIZE = issued;
}

var EDITABLE_PRIZE;
getEditable = () => {
    return EDITABLE_PRIZE;
}
setEditable = (editable) => {
    EDITABLE_PRIZE = editable;
}

module.exports = {
    makePrizeExcel
}