const Log = require('../utils/debug.js');

/**
 * 교직원 기본정보
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function updateTeacherBasicInfo(req, res, connection)  {

    //기본정보 저장    
    let sql = `
    UPDATE TEACHER
    SET`;
    
    sql += !!req.body.teacherNo    ?    ` TEACHER_NO = '${req.body.teacherNo}' ,`            : '';
    sql += !!req.body.teacherName  ?    ` TEACHER_NAME = '${req.body.teacherName}' ,`        : '';
    sql += !!req.body.teacherEngName  ? ` TEACHER_ENG_NAME = '${req.body.teacherEngName}' ,` : '';
    sql += !!req.body.birthday     ?    ` BIRTHDAY = '${req.body.birthday}' ,`               : '';
    sql += !!req.body.email        ?    ` EMAIL = '${req.body.email}' ,`                     : '';
    sql += !!req.body.gender       ?    ` GENDER = '${req.body.gender}' ,`                   : '';
    sql += !!req.body.joinDay      ?    ` JOIN_DAY = '${req.body.joinDay}' ,`                : '';
    sql += !!req.body.duty         ?    ` DUTY = '${req.body.duty}' ,`                : '';
    sql += !!req.body.plz          ?    ` PLZ = '${req.body.plz}' ,`                         : '';
    sql += !!req.body.addressCity  ?    ` ADDRESS_CITY = '${req.body.addressCity}' ,`        : '';
    sql += !!req.body.addressDtl   ?    ` ADDRESS_DTL = '${req.body.addressDtl}' ,`          : '';
    sql += !!req.body.workStatus   ?    ` WORK_STATUS = '${req.body.workStatus}' ,`          : '';

    if(req.body.workStatus === 'R'){
        sql += !!req.body.resignDay    ?    ` RESIGN_DAY = '${req.body.resignDay}' ,`        : '';
    }else if(req.body.workStatus === 'W'){
        sql += ` RESIGN_DAY = null ,`;
    }
        
    sql += `
        UDT_ID =  '${req.body.updId}',
        UDT_DTM = NOW()        
    WHERE TEACHER_ID = ${req.body.teacherId}
    `;

    //교직원정보 저장
    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => {            
            if(err) {
                Log.error(`/api/teacher/update called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/teacher/update called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//updateTeacherBasicInfo

module.exports = {
    updateTeacherBasicInfo
}
