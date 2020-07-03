const Log = require('../utils/debug.js');

/**
 * 학기 정보 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveSemester(req, res, connection)  {
    Log.print(`학기정보 저장`);
 
    if(!req.body.semesterId){
        res.send({"result":"failed","error":"학기ID 누락"});
    }

    let sql = `
    INSERT INTO SEMESTER (
        SEMESTER_ID,
        SEMESTER_NAME,
        START_DATE,
        END_DATE,
        RECEIPT_START_DATE,
        RECEIPT_END_DATE,
        SCHOOL_DAYS_COUNT,       
        USE_YN,        
        CRE_ID,
        CRE_DTM
    ) VALUES (
         ${req.body.semesterId} ,
        '${req.body.semesterName}' ,
        '${req.body.startDate}' ,
        '${req.body.endDate}' ,
        '${req.body.receiptStartDate}' ,
        '${req.body.receiptEndDate}' ,
         ${req.body.schoolDaysCount} ,
        'Y' ,
        '${req.body.creId}' ,
        NOW()
    )`;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/semester/save failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/semester/save called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//saveSemester

module.exports = {
    saveSemester
}
