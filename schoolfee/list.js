const Log = require('../utils/debug.js');

/**
 * 수업료 목록 조회
 */    
schoolfeeList = (req, res, connection) => { 
    
    let sql = `
    SELECT  APPLY_YEAR AS "applyYear",
            APPLY_MONTH AS "applyMonth",
            REGULAR_SCHOOL_FEE AS "regularSchoolFee",
            EXTRA_SCHOOL_FEE1 AS "extraSchoolFee1",
            EXTRA_SCHOOL_FEE2 AS "extraSchoolFee2",
            REGULAR_SCHOOL_FEE_DISCOUNT AS "regularSchoolFeeDiscount",
            EXTRA_SCHOOL_FEE1_DISCOUNT AS "extraSchoolFee1Discount",
            EXTRA_SCHOOL_FEE2_DISCOUNT AS "extraSchoolFee2Discount",  
            B.CODE_NAME AS "applyMonthName",
            A.SEMESTER_ID AS "semesterId",
            (SELECT COUNT(*) FROM PAYMENT P
             WHERE P.PAYMENT_YEAR = A.APPLY_YEAR
             AND P.PAYMENT_MONTH = A.APPLY_MONTH) AS "paymentCount"
    FROM SCHOOL_FEE A
    LEFT OUTER JOIN COMMON_CODE B ON A.APPLY_MONTH = B.CODE AND B.SUPER_CODE = 'MONTH'
    WHERE A.USE_YN = 'Y'
    `;

    if(!!req.query.applyYear) {
        sql += "\n" + `AND APPLY_YEAR = '${req.query.applyYear}'`; 
    }

    sql += `   
    ORDER BY CONCAT(APPLY_YEAR, APPLY_MONTH) 
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/schoolfee/list failed. sql=${sql}, error=${err}`);
                res.send({"schoolfees": []});
            }else{             
                let schoolfees = [];
                for(let i=0; i < rows.length; i++){
                    schoolfees.push(rows[i]);
                }
                Log.print(`/api/schoolfee/list called  sql=${sql}`);
                res.send({"schoolfees": schoolfees});
            }
        }
    );
}//schoolfeeList



module.exports = {
    schoolfeeList
}