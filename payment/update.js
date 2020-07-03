const Log = require('../utils/debug.js');

/**
 * 납부 수정
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function paymentUpdate(req, res, connection)  {

    let schoolfee = (req.body.schoolFeeStatus === "BATCH" || req.body.schoolFeeStatus === "PAYMENT") ?  req.body.schoolFee : "0";
 
    let sql = `
    UPDATE PAYMENT 
    SET SCHOOL_FEE_STATUS = '${req.body.schoolFeeStatus}',
        SCHOOL_FEE = '${schoolfee}',
        UDT_ID = '${req.body.udtId}',
        UDT_DTM = NOW()
    WHERE STUDENT_ID  =  '${req.body.studentId}'
    AND PAYMENT_YEAR = '${req.body.applyYear}' 
    AND PAYMENT_MONTH = '${req.body.applyMonth}' 
    AND SCHOOL_FEE_TYPE = '${req.body.schoolfeeType}' 
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/payment/update failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/payment/update called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//paymentUpdate

module.exports = {
    paymentUpdate
}
