const Log = require('../utils/debug.js');

/**
 * 납부 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function paymentSave(req, res, connection)  {

    let schoolfee = (req.body.schoolFeeStatus === "BATCH" || req.body.schoolFeeStatus === "PAYMENT") ?  req.body.schoolFee : "0";
 
    let sql = '';
    //req.body.schoolFeeStatus 가 값이 없으면 납부여부 콤보박스에서 아무것도 선택하자 않은 것이다.
    if(req.body.schoolFeeStatus === ""){
        sql = `
        DELETE FROM PAYMENT
        WHERE STUDENT_ID = '${req.body.studentId}'
          AND PAYMENT_YEAR = '${req.body.applyYear}'
          AND PAYMENT_MONTH = '${req.body.applyMonth}'
          AND SCHOOL_FEE_TYPE = '${req.body.schoolfeeType}';
        `;
    }else{
        sql = `
        DELETE FROM PAYMENT
        WHERE STUDENT_ID = '${req.body.studentId}'
          AND PAYMENT_YEAR = '${req.body.applyYear}'
          AND PAYMENT_MONTH = '${req.body.applyMonth}'
          AND SCHOOL_FEE_TYPE = '${req.body.schoolfeeType}';

        INSERT INTO PAYMENT (
            STUDENT_ID,
            PAYMENT_YEAR,
            PAYMENT_MONTH,
            SCHOOL_FEE_STATUS,
            SCHOOL_FEE_TYPE,
            SCHOOL_FEE,
            USE_YN,
            CRE_ID,
            CRE_DTM
        ) VALUES (
            '${req.body.studentId}' ,
            '${req.body.applyYear}' ,
            '${req.body.applyMonth}' ,
            '${req.body.schoolFeeStatus}' ,
            '${req.body.schoolfeeType}' ,
            '${schoolfee}' ,
            'Y' ,
            '${req.body.creId}' ,
            NOW()
        );`;

    }

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/payment/save failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/payment/save called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//paymentSave

/**
 * 수업료 일괄입금
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function paymentSaveBatch(req, res, connection)  {
 
    let sql = `
    DELETE FROM PAYMENT
    WHERE PAYMENT_YEAR = '${req.body.applyYear}' 
    AND PAYMENT_MONTH = '${req.body.applyMonth}' ;

    INSERT INTO PAYMENT (
        STUDENT_ID,
        PAYMENT_YEAR,
        PAYMENT_MONTH,
        SCHOOL_FEE_TYPE,
        SCHOOL_FEE_STATUS,
        SCHOOL_FEE,
        USE_YN,
        CRE_ID,
        CRE_DTM
    ) 
    SELECT DISTINCT A.STUDENT_ID,
        '${req.body.applyYear}',
        '${req.body.applyMonth}',
        C.SCHOOLFEE_TYPE,
        
        'BATCH',
        (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                     WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                     WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                     WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                     WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                     WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                     ELSE 0 
                END
        FROM SCHOOL_FEE X
        WHERE X.APPLY_YEAR = '${req.body.applyYear}'
        AND X.APPLY_MONTH = '${req.body.applyMonth}') AS SCHOOL_FEE,
        'Y',
        '${req.body.creId}',
        NOW()
    FROM STUDENT_BASIC_INFO A
    LEFT OUTER JOIN CLASSINFO_STUDENTS B ON A.STUDENT_ID = B.STUDENT_ID
    LEFT OUTER JOIN CLASS_INFO C ON B.CLASS_ID = C.CLASS_ID
    LEFT OUTER JOIN SEMESTER D ON D.SEMESTER_ID = C.SEMESTER_ID
    WHERE 1=1
    AND D.SEMESTER_ID = '${req.body.semesterId}'
    AND (
        CASE WHEN B.ABANDON_REASON IS NULL AND
                   D.START_DATE = B.START_DATE AND
                   LAST_DAY(CAST(CONCAT('${req.body.applyYear}','${req.body.applyMonth}','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                   THEN 1 
            WHEN B.ABANDON_REASON IS NULL AND
                   D.START_DATE != B.START_DATE AND
                   LAST_DAY(CAST(CONCAT('${req.body.applyYear}','${req.body.applyMonth}','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                   THEN 1 
           WHEN B.ABANDON_REASON IS NOT NULL AND
                   D.START_DATE = B.START_DATE AND
                   LAST_DAY(CAST(CONCAT('${req.body.applyYear}','${req.body.applyMonth}','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
              THEN 1 
           WHEN B.ABANDON_REASON IS NOT NULL AND
                   D.START_DATE != B.START_DATE AND
                   LAST_DAY(CAST(CONCAT('${req.body.applyYear}','${req.body.applyMonth}','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
              THEN 1
              ELSE 0 
        END ) > 0 ;
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/payment/batch/save failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/payment/batch/save called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//paymentSaveBatch

module.exports = {
    paymentSave,
    paymentSaveBatch
}
