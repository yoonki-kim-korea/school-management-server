const Log = require('../utils/debug.js');

/**
 * 수업료 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function schoolfeeSave(req, res, connection)  {
    let applyMonths = req.body.applyMonths.split("|");
    let total = applyMonths.length;
    let success = 0;

    try {            
        for(let i=0; i<applyMonths.length; i++){
            let year = applyMonths[i].substring(0,4);
            let month = applyMonths[i].substring(4,6);
            req.body.applyYear = year;
            req.body.applyMonth = month;

            let sql = `
            INSERT INTO SCHOOL_FEE (
                APPLY_YEAR,
                APPLY_MONTH,
                REGULAR_SCHOOL_FEE,
                EXTRA_SCHOOL_FEE1,
                EXTRA_SCHOOL_FEE2,
                REGULAR_SCHOOL_FEE_DISCOUNT,
                EXTRA_SCHOOL_FEE1_DISCOUNT,
                EXTRA_SCHOOL_FEE2_DISCOUNT,
                USE_YN,
                CRE_ID,
                CRE_DTM
            ) VALUES (
                '${req.body.applyYear}' ,
                '${req.body.applyMonth}' ,
                '${req.body.regularSchoolFee}' ,
                '${req.body.extraSchoolFee1}' ,
                '${req.body.extraSchoolFee2}' ,
                '${req.body.regularSchoolFeeDiscount}' ,
                '${req.body.extraSchoolFee1Discount}' ,
                '${req.body.extraSchoolFee2Discount}' ,
                'Y' ,
                '${req.body.creId}' ,
                NOW()
            )`;
        
            let params = [];
            connection.query(sql, params, 
                (err, rows, fields) => { 
                    if(err) {
                        Log.print(`/api/schoolfee/save failed. sql=${sql}, error=${err}`);
                    }else{
                        Log.print(`/api/schoolfee/save called. sql=${sql} `);
                        success++;
                    }
                }
            );
        }//for
    } catch (error) {
        Log.error(`/api/schoolfee/save failed. total=${total} , error=${error}`);
        res.send({"result":"failed"});
    }
    Log.print(`/api/schoolfee/save called. total=${total} , success=${success}`);
    res.send({"result":"success"});
}

module.exports = {
    schoolfeeSave
}
