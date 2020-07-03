const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 기부금영수증 엑셀 출력
 */
makeContributionExcel = async (req, res, connection) => {
    Log.print('/api/print/excel/contribution called');
    try {
        let documentInfo = JSON.parse(req.body.documentInfo);
        let payment = JSON.parse(req.body.payment);
        let issued = JSON.parse(req.body.issued);
        let fileName = payment.studentNo + payment.koreanName;
        //comment
        let moneyValue = Utils.money(payment.fee2) + ' EUR';
        let moneyString = Utils.moneyString(payment.fee2);
        let comment = `${moneyValue} / ${moneyString} / i.d.Z.v. ${Utils.getDuration()}`;
        payment.comment = comment;
        //comment

        let contributionFile = `${excelConf.excelDir}${excelConf.contributionDir}${fileName}_기부금영수증${excelConf.contributionExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.contribution}`, contributionFile);
        await copyContributionContents(documentInfo, payment, issued,  contributionFile);
        await issuedSave.issuedSave(issued, comment, payment.studentId, req.body.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/address address failed error=${error}`);   
        res.send({"result": "failed"});
     }
}//makeContributionExcel

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

var PAYMENT;
getPayment = () => {
    return PAYMENT;
}
setPayment = (payment) => {
    PAYMENT = payment;
}

/**
 * 템플릿에 기부금영수증 출력
 */
copyContributionContents = async (documentInfo, payment, issued, targetFile) =>{
    try {        
        Log.print('/api/print/excel/contribution copyContents called');
        setDocumnetInfo(documentInfo);
        setIssued(issued);
        setPayment(payment);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(function() {
            let worksheet = workbook.getWorksheet('data');
            let documentInfo = getDocumnetInfo();
            let issued = getIssued();
            let payment = getPayment();
            worksheet.getCell('A1').value = Utils.findItemValue(documentInfo, 'schoolNameGr');
            worksheet.getCell('A2').value = Utils.findItemValue(documentInfo, 'address');
            worksheet.getCell('A3').value = Utils.findItemValue(documentInfo, 'Vorstandsvorsitzender');
            worksheet.getCell('A4').value = Utils.findItemValue(documentInfo, 'Schuldirektorin');
            worksheet.getCell('A5').value = Utils.findItemValue(documentInfo, 'Sitz');
            worksheet.getCell('A6').value = Utils.findItemValue(documentInfo, 'Amtsgericht');
            worksheet.getCell('A7').value = Utils.findItemValue(documentInfo, 'Tel');
            worksheet.getCell('A8').value = Utils.findItemValue(documentInfo, 'Email');
            worksheet.getCell('A9').value = Utils.findItemValue(documentInfo, 'Homepage');
            worksheet.getCell('A10').value = Utils.findItemValue(documentInfo, 'Bank');
            worksheet.getCell('A11').value = Utils.findItemValue(documentInfo, 'IBAN');
            worksheet.getCell('A12').value = Utils.findItemValue(documentInfo, 'BIC');
            worksheet.getCell('A13').value = Utils.findItemValue(documentInfo, 'text1');
            worksheet.getCell('A14').value = Utils.findItemValue(documentInfo, 'text2');
            worksheet.getCell('A15').value = Utils.findItemValue(documentInfo, 'text3');
            worksheet.getCell('A16').value = Utils.findItemValue(documentInfo, 'text4');
            worksheet.getCell('A17').value = Utils.findItemValue(documentInfo, 'text5');
            worksheet.getCell('A18').value = Utils.findItemValue(documentInfo, 'text6');
            worksheet.getCell('A19').value = Utils.findItemValue(documentInfo, 'text7');
            worksheet.getCell('A20').value = Utils.findItemValue(documentInfo, 'VorstandvorsitzenderSignature');
            
            worksheet.getCell('B1').value = Utils.convertGermanStyleDate(issued.issuedDate, '-');
            worksheet.getCell('B2').value = Utils.getDocuNo(issued);
            worksheet.getCell('B3').value = payment.applicant + " / " + payment.addressDtl + " / " + payment.plz + ' ' + payment.addressCity;
            worksheet.getCell('B4').value = payment.comment;
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/address address failed error=${error}`);        
    }
}
module.exports = {
    makeContributionExcel
}