const Log = require('../utils/debug.js');

/**
 * 수업료 목록 조회
 */    
schoolfeeView = (req, res, connection) => { 
    
    let sql = `
    SELECT  APPLY_YEAR AS "applyYear",
            APPLY_MONTH AS "applyMonth",
            REGULAR_SCHOOL_FEE AS "regularSchoolFee",
            EXTRA_SCHOOL_FEE1 AS "extraSchoolFee1",
            EXTRA_SCHOOL_FEE2 AS "extraSchoolFee2",
            REGULAR_SCHOOL_FEE_DISCOUNT AS "regularSchoolFeeDiscount",
            EXTRA_SCHOOL_FEE1_DISCOUNT AS "extraSchoolFee1Discount",
            EXTRA_SCHOOL_FEE2_DISCOUNT AS "extraSchoolFee2Discount" 
    FROM SCHOOL_FEE
    WHERE APPLY_START_YEAR= ${req.query.applyYear}
    AND APPLY_START_MONTH = ${req.query.applyMonth}
    `;
    
    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/document/schoolfee/view failed. sql=${sql}, error=${err}`);
                res.send({"studentInfos": []});
            }else{         
                let studentInfos = [];
                for(let i=0; i < rows.length; i++){
                    studentInfos.push(rows[i]);
                }
                Log.print(`/api/document/schoolfee/view called  sql=${sql}`);
                res.send({"studentInfos": studentInfos});
            }
        }
    );
}//schoolfeePersonList

module.exports = {
    schoolfeeView
}