const Log = require('../utils/debug.js');

/**
 * 수업료 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function schoolfeeUpdate(req, res, connection)  {
    
    let sql = `
    UPDATE SCHOOL_FEE 
    SET REGULAR_SCHOOL_FEE = '${req.body.regularSchoolFee}',
        EXTRA_SCHOOL_FEE1 = '${req.body.extraSchoolFee1}',
        EXTRA_SCHOOL_FEE2 = '${req.body.extraSchoolFee2}',
        REGULAR_SCHOOL_FEE_DISCOUNT = '${req.body.regularSchoolFeeDiscount}',
        EXTRA_SCHOOL_FEE1_DISCOUNT = '${req.body.extraSchoolFee1Discount}',
        EXTRA_SCHOOL_FEE2_DISCOUNT = '${req.body.extraSchoolFee2Discount}',
        UDT_DTM = NOW(),
        UDT_ID = '${req.body.udtId}'
    WHERE APPLY_YEAR = '${req.body.applyYear}'
      AND APPLY_MONTH = '${req.body.applyMonth}';
    `;

    //수업료를 이미 납입한 학생이 있는 경우 수정된 수업료로 같이 저장한다.
    if( `${req.body.paymentChageYn === 'Y'}`){
    sql += `
        UPDATE PAYMENT X INNER JOIN 
              (SELECT P.PAYMENT_YEAR , P.PAYMENT_MONTH, P.STUDENT_ID, A.REDUCTION_TYPE, P.SCHOOL_FEE_TYPE, P.SCHOOL_FEE, 
                      #수업료감면여부, 수업료유형에 따라 적용할 수업료 선택
                      CASE  WHEN A.REDUCTION_TYPE = 'NA' AND P.SCHOOL_FEE_TYPE = 'RE' THEN C.REGULAR_SCHOOL_FEE  #해당없음,정규수업,정규수업 수업료
                            WHEN A.REDUCTION_TYPE = 'NA' AND P.SCHOOL_FEE_TYPE = 'E1' THEN C.EXTRA_SCHOOL_FEE1  #해당없음,비정규수업1,비정규수업 수업료1
                            WHEN A.REDUCTION_TYPE = 'NA' AND P.SCHOOL_FEE_TYPE = 'E2' THEN C.EXTRA_SCHOOL_FEE2  #해당없음,비정규수업2,비정규수업 수업료2
                            
                            WHEN A.REDUCTION_TYPE = 'TC' AND P.SCHOOL_FEE_TYPE = 'RE' THEN C.REGULAR_SCHOOL_FEE_DISCOUNT  #교직원 자녀,정규수업,정규수업 수업료 할인
                            WHEN A.REDUCTION_TYPE = 'TC' AND P.SCHOOL_FEE_TYPE = 'E1' THEN C.EXTRA_SCHOOL_FEE1_DISCOUNT  #교직원 자녀,비정규수업1,비정규수업 수업료1 할인
                            WHEN A.REDUCTION_TYPE = 'TC' AND P.SCHOOL_FEE_TYPE = 'E2' THEN C.EXTRA_SCHOOL_FEE2_DISCOUNT  #교직원 자녀,비정규수업2,비정규수업 수업료2 할인
                            
                            WHEN A.REDUCTION_TYPE = 'MC' AND P.SCHOOL_FEE_TYPE = 'RE' THEN C.REGULAR_SCHOOL_FEE_DISCOUNT #3자녀가정,정규수업,정규수업 수업료 할인
                            WHEN A.REDUCTION_TYPE = 'MC' AND P.SCHOOL_FEE_TYPE = 'E1' THEN C.EXTRA_SCHOOL_FEE1_DISCOUNT #3자녀가정,비정규수업1,비정규수업 수업료1 할인
                            WHEN A.REDUCTION_TYPE = 'MC' AND P.SCHOOL_FEE_TYPE = 'E2' THEN C.EXTRA_SCHOOL_FEE2_DISCOUNT #3자녀가정,비정규수업2,비정규수업 수업료2 할인
                            
                            WHEN A.REDUCTION_TYPE = 'SS' AND P.SCHOOL_FEE_TYPE = 'RE' THEN C.REGULAR_SCHOOL_FEE_DISCOUNT #장학생,정규수업,정규수업 수업료 할인
                            WHEN A.REDUCTION_TYPE = 'SS' AND P.SCHOOL_FEE_TYPE = 'E1' THEN C.EXTRA_SCHOOL_FEE1_DISCOUNT #장학생,비정규수업1,비정규수업 수업료1 할인
                            WHEN A.REDUCTION_TYPE = 'SS' AND P.SCHOOL_FEE_TYPE = 'E2' THEN C.EXTRA_SCHOOL_FEE2_DISCOUNT #장학생,비정규수업2비정규수업 수업료2 할인
                            ELSE P.SCHOOL_FEE
                        END AS NEW_SCHOOL_FEE
                    FROM PAYMENT P
                    INNER JOIN CLASSINFO_STUDENTS A ON P.STUDENT_ID = A.STUDENT_ID
                    INNER JOIN CLASS_INFO B ON A.CLASS_ID = B.CLASS_ID
                    INNER JOIN SCHOOL_FEE C ON C.APPLY_YEAR = P.PAYMENT_YEAR AND C.APPLY_MONTH = P.PAYMENT_MONTH
                    WHERE P.PAYMENT_YEAR = '${req.body.applyYear}'
                    AND P.PAYMENT_MONTH = '${req.body.applyMonth}'
                    AND B.SEMESTER_ID = '${req.body.applySemesterId}') Y
            ON X.PAYMENT_YEAR = Y.PAYMENT_YEAR
            AND X.PAYMENT_MONTH = Y.PAYMENT_MONTH
            AND X.STUDENT_ID = Y.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = Y.SCHOOL_FEE_TYPE
        SET X.SCHOOL_FEE = Y.NEW_SCHOOL_FEE;    
        `;        
    }//if

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/schoolfee/update failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/schoolfee/update called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}


/**
 * 수업료 관리에서 적용학기 셀렉트 박스 선택했을 때 저장함.
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function schoolfeeSemesterUpdate(req, res, connection)  {
    
    let sql = `
    UPDATE SCHOOL_FEE 
    SET SEMESTER_ID = '${req.body.semesterId}',
        UDT_DTM = NOW(),
        UDT_ID = '${req.body.udtId}'
    WHERE APPLY_YEAR = '${req.body.applyYear}'
      AND APPLY_MONTH = '${req.body.applyMonth}'
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/schoolfee/semester/update failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/schoolfee/semester/update called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    schoolfeeUpdate,
    schoolfeeSemesterUpdate
}
