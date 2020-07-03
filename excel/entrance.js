const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 입학통지서 출력
 */
copyEntranceContents = async (documentInfo, editable, issued, targetFile) => {
    try {     
        setDocumnetInfo(documentInfo);
        setIssued(issued);
        setEditable(editable);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(() => {
            const delimiter = '.';
            let worksheet = workbook.getWorksheet('data');
            let documentInfo = getDocumnetInfo();
            let issued = getIssued();
            let editable = getEditable();
            worksheet.getCell('A1').value  = Utils.findItemValue(documentInfo, 'schoolNameKr');//학교명
            worksheet.getCell('A2').value  = `${Utils.findItemValue(documentInfo, 'schoolNameGr')} ${Utils.findItemValue(documentInfo, 'address')}`;
            worksheet.getCell('A3').value  = Utils.findItemValue(documentInfo, 'TelEmailHomepage');//연락처
            worksheet.getCell('A4').value  = Utils.getDocuNo(issued);//문서번호
            worksheet.getCell('A5').value  = Utils.convertKoreanStyleDate(issued.issuedDate);//발행일자        
            worksheet.getCell('A6').value  = editable.receiver; //수신
            worksheet.getCell('A7').value  = editable.title;//제목

            if(editable.father && editable.mother){
                worksheet.getCell('A8').value = `${editable.father}, ${editable.mother} 귀하`;
            }else if(editable.father && !editable.mother){
                worksheet.getCell('A8').value = `${editable.father} 귀하`;
            }else if(!editable.father && editable.mother){
                worksheet.getCell('A8').value = `${editable.mother} 귀하`;
            }else{
                worksheet.getCell('A8').value = `부모 선택안함`;
            }

            worksheet.getCell('A9').value  = `${editable.koreanName} (${editable.genderName})`; 
            worksheet.getCell('A10').value = editable.birthday;
            worksheet.getCell('A11').value = editable.comment;
            worksheet.getCell('A12').value = Utils.findItemValue(documentInfo, 'content1') + ' (교무부:' + Utils.findItemValue(documentInfo, 'affairsEmail') + ')';
            worksheet.getCell('A13').value = Utils.findItemValue(documentInfo, 'content2');
            worksheet.getCell('A14').value = `${Utils.findItemValue(documentInfo, 'schoolNameKr')} ${Utils.findItemValue(documentInfo, 'principal')}`;;
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/entrance failed error=${error}`);        
    }
}

/**
 * 입학통지서
 */
makeEntranceExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/entrance called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let editable = JSON.parse(req.body.editable);
        let issued = JSON.parse(req.body.issued);
        let fileName = editable.studentNo + editable.koreanName;   
        let objectFile = `${excelConf.excelDir}${excelConf.entranceDir}${fileName}_입학통지서${excelConf.entranceExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.entrance}`, objectFile);
        await copyEntranceContents(documentInfo, editable, issued, objectFile);
        await issuedSave.issuedSave(issued, editable.comment, editable.studentId, editable.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/entrance failed error=${error}`);    
        res.send({"result": "failed"});
     }
}//makeEntranceExcel

var DOCUMENT_ENTRANCE;
getDocumnetInfo = () => {
    return DOCUMENT_ENTRANCE;
}
setDocumnetInfo = (documentInfo) => {
    DOCUMENT_ENTRANCE = documentInfo;
}

var ISSUED_ENTRANCE;
getIssued = () => {
    return ISSUED_ENTRANCE;
}
setIssued = (issued) => {
    ISSUED_ENTRANCE = issued;
}

var EDITABLE_ENTRANCE;
getEditable = () => {
    return EDITABLE_ENTRANCE;
}
setEditable = (editable) => {
    EDITABLE_ENTRANCE = editable;
}

module.exports = {
    makeEntranceExcel
}