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
        let classbooks = `${excelConf.excelDir}${excelConf.classbookDir}${fileName}_출석부${excelConf.classbookExt}`;
        fse.copySync(`${excelConf.templateDir}${excelConf.classbook}`, classbooks);
        await makeClassbook(classinfo, classbooks);
        res.send({"result": "success"});
     } catch (error) {
        Log.error(`/api/classbook/excel classbook failed error=${error}`);
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
 * 출석부 작성
 */
makeClassbook = async (classinfo, targetFile) => {    
    //출석부 생성
    try {
        setClassinfo(classinfo);
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(targetFile)
        .then(function() {
            let worksheet = workbook.getWorksheet('data');
            classinfo = getClassinfo(); Log.print(classinfo);
            const MAX_STUDENTS = 35;
            let address = classinfo.address;
            let ClassName = `${classinfo.departmentName} ${classinfo.classTimeName} ${classinfo.className}`;
            let Teacher = `${classinfo.teacherName}`;
            let Capacity = address.length; //`${classinfo.classCapacity}`;//재적
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
            }//for
        })
        .catch(err => {Log.error(err)});
        await workbook.xlsx.writeFile(targetFile);  
    } catch (error) {
        Log.error(`/api/classbook/excel classbook failed error=${error}`);
    }
}


module.exports = {
    makeExcel
}