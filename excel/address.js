const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');
const Log = require('../utils/debug.js');
const Utils = require('../utils/utils.js');

makeExcel = async (req, res) => {
    try {
        let classinfo = JSON.parse(req.body.classinfo);
        let fileName = classinfo.fileName;        
        let address = `${excelConf.excelDir}${excelConf.addressDir}${fileName}_주소록${excelConf.addressExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.address}`, address);
        await makeAddress(classinfo, address);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/print/excel/address address failed error=${error}`);      
        res.send({"result": "failed"});
     }
}//makeExcel

var CLASSINFO;
getClassinfo = () => {
    return CLASSINFO;
}
setClassinfo = (classinfo) => {
    CLASSINFO = classinfo;
}

/**
 * 주소록 작성
 */
makeAddress = async (classinfo, targetFile) =>{
    try {        
        setClassinfo(classinfo);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(function() {
            let worksheet = workbook.getWorksheet('data');
            classinfo = getClassinfo();
            const MAX_STUDENTS = 35;
            let address = classinfo.address;
            let ClassName = `${classinfo.departmentName} ${classinfo.classTimeName} ${classinfo.className}`;
            let Teacher = `${classinfo.teacherName}`;
            let Capacity = address.length; //`${classinfo.classCapacity}`; //재적
            let Classroom = `${classinfo.classroomName}`;
            let Startdate = `${classinfo.startDate}`;
            worksheet.getCell('A1').value = ClassName;
            worksheet.getCell('A2').value = Teacher;
            worksheet.getCell('A3').value = Capacity;
            worksheet.getCell('A4').value = Classroom;
            worksheet.getCell('A5').value = Utils.convertDate(Startdate,'-');
            for(let j=0; j<address.length && j<MAX_STUDENTS; j++){
                worksheet.getCell(`B${j+1}`).value = address[j].studentNo;
                worksheet.getCell(`C${j+1}`).value = address[j].name;
                worksheet.getCell(`D${j+1}`).value = address[j].telephone;
                worksheet.getCell(`E${j+1}`).value = address[j].email;
                worksheet.getCell(`F${j+1}`).value = address[j].addressDtl;
                worksheet.getCell(`G${j+1}`).value = address[j].plz;
                worksheet.getCell(`H${j+1}`).value = address[j].addressCity;
                worksheet.getCell(`I${j+1}`).value = address[j].father;
                worksheet.getCell(`J${j+1}`).value = address[j].mother;
            }//for
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/print/excel/address address failed error=${error}`);        
    }
}
module.exports = {
    makeExcel
}