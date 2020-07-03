const Log = require('../utils/debug.js');

/**
 * 학기 정보 수정
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function updateSemester(req, res, connection)  {

    let sql = `
    UPDATE SEMESTER 
    SET SEMESTER_ID = '${req.body.newSemesterId}',
        SEMESTER_NAME = '${req.body.semesterName}',
        START_DATE = '${req.body.startDate}',
        END_DATE =  '${req.body.endDate}' ,
        RECEIPT_START_DATE = ${req.body.receiptStartDate},
        RECEIPT_END_DATE = ${req.body.receiptEndDate},
        SCHOOL_DAYS_COUNT = ${req.body.schoolDaysCount},      
        UDT_DTM = NOW(),
        UDT_ID = '${req.body.udtId}'
    WHERE SEMESTER_ID = '${req.body.semesterId}'
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/semester/update failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/semester/update called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//updateSemester

module.exports = {
    updateSemester
}
