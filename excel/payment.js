const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const issuedSave = require('../issued/save.js');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

/**
 * 템플릿에 납입증명서 출력
 */
copyPaymentContents = async (documentInfo, payment, issued, targetFile) => {
    try {     
        setDocumnetInfo(documentInfo);
        setIssued(issued);
        setPayment(payment);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(() => {
            let worksheet = workbook.getWorksheet('data');
            let documentInfo = getDocumnetInfo();
            let issued = getIssued();
            let payment = getPayment();

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
            worksheet.getCell('B1').value = payment.comment;
            worksheet.getCell('B2').value = Utils.getDuration();
            worksheet.getCell('B3').value = Utils.money(payment.fee1) + ' EUR';
            worksheet.getCell('B4').value = Utils.money(payment.admissionFee) + ' EUR';
            worksheet.getCell('B5').value = Utils.money(parseFloat(payment.fee1) + parseFloat(payment.admissionFee)) + ' EUR';
            worksheet.getCell('B6').value = Utils.convertGermanStyleDate(issued.issuedDate);
            worksheet.getCell('B7').value = Utils.getDocuNo(issued);
            worksheet.getCell('B8').value = payment.applicant;            
            worksheet.getCell('B9').value = payment.addressDtl;
            worksheet.getCell('B10').value = payment.plz + ' ' + payment.addressCity; 
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/address address failed error=${error}`);        
    }
}

/**
 * 납입증명서
 */
makePaymentExcel = async (req, res, connection) => {
    try {
        Log.print('/api/print/excel/payment called');
        let documentInfo = JSON.parse(req.body.documentInfo);
        let payment = JSON.parse(req.body.payment);
        let issued = JSON.parse(req.body.issued);
        let fileName = payment.studentNo + payment.koreanName;   
        let paymentFile = `${excelConf.excelDir}${excelConf.paymentDir}${fileName}_납입증명서${excelConf.paymentExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.payment}`, paymentFile);
        await copyPaymentContents(documentInfo, payment, issued, paymentFile);
        await issuedSave.issuedSave(issued, payment.comment, payment.studentId, payment.creId, connection);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/address address failed error=${error}`);  
        res.send({"result": "failed"});
     }
}//makePaymentExcel

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

module.exports = {
    makePaymentExcel
}