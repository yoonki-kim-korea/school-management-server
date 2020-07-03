const Log = require('../utils/debug.js');

//미납자 목록 조회
defaulterList = (req, res, connection) => { 

    let sql = `
    SELECT A.STUDENT_ID,
        A.STUDENT_NO AS "studentNo",
        A.KOREAN_NAME AS "studentName",
        A.ENTRANCE_DAY AS "entranceDay",
        A.ADMISSION_FEE,
        A.LAST_CLASS_ID,
        B.CLASS_NAME AS "className",
        C.FATHER_NAME AS "father", C.FATHER_PHONE_NO AS "fatherPhoneNo", C.MOTHER_NAME AS "mother", C.MOTHER_PHONE_NO AS "motherPhoneNo",
        C1.CODE_NAME AS "department",
        D.TEACHER_NAME AS "teacher",
        '${req.query.applyYear}' AS "applyYear",
        SUM(
            IFNULL(FEE_01,0) + 
            IFNULL(FEE_02,0) + 
            IFNULL(FEE_03,0) + 
            IFNULL(FEE_04,0) + 
            IFNULL(FEE_05,0) + 
            IFNULL(FEE_06,0) + 
            IFNULL(FEE_07,0) + 
            IFNULL(FEE_08,0) + 
            IFNULL(FEE_09,0) + 
            IFNULL(FEE_10,0) + 
            IFNULL(FEE_11,0) + 
            IFNULL(FEE_12,0)
        ) AS "totalFee",
        
        SUM(
            IFNULL(PAY_01,0) +		
            IFNULL(PAY_02,0) +
            IFNULL(PAY_03,0) +
            IFNULL(PAY_04,0) +		
            IFNULL(PAY_05,0) +	
            IFNULL(PAY_06,0) +		
            IFNULL(PAY_07,0) +		
            IFNULL(PAY_08,0) +	
            IFNULL(PAY_09,0) +	
            IFNULL(PAY_10,0) +	
            IFNULL(PAY_11,0) +	
            IFNULL(PAY_12,0) 
        ) AS "totalPay",

        SUM(
            IFNULL(FEE_01,0) + 
            IFNULL(FEE_02,0) + 
            IFNULL(FEE_03,0) + 
            IFNULL(FEE_04,0) + 
            IFNULL(FEE_05,0) + 
            IFNULL(FEE_06,0) + 
            IFNULL(FEE_07,0) + 
            IFNULL(FEE_08,0) + 
            IFNULL(FEE_09,0) + 
            IFNULL(FEE_10,0) + 
            IFNULL(FEE_11,0) + 
            IFNULL(FEE_12,0)
        ) - 
        
        SUM(
            IFNULL(PAY_01,0) +		
            IFNULL(PAY_02,0) +
            IFNULL(PAY_03,0) +
            IFNULL(PAY_04,0) +		
            IFNULL(PAY_05,0) +	
            IFNULL(PAY_06,0) +		
            IFNULL(PAY_07,0) +		
            IFNULL(PAY_08,0) +	
            IFNULL(PAY_09,0) +	
            IFNULL(PAY_10,0) +	
            IFNULL(PAY_11,0) +	
            IFNULL(PAY_12,0) 
        ) AS "totalBalance",
                
        SUM(FEE_01) AS "fee01",
        SUM(FEE_02) AS "fee02",
        SUM(FEE_03) AS "fee03",
        SUM(FEE_04) AS "fee04",
        SUM(FEE_05) AS "fee05",
        SUM(FEE_06) AS "fee06",
        SUM(FEE_07) AS "fee07",
        SUM(FEE_08) AS "fee08",
        SUM(FEE_09) AS "fee09",
        SUM(FEE_10) AS "fee10",
        SUM(FEE_11) AS "fee11",
        SUM(FEE_12) AS "fee12",
        
        SUM(PAY_01) AS "pay01",		
        SUM(PAY_02) AS "pay02",		
        SUM(PAY_03) AS "pay03",		
        SUM(PAY_04) AS "pay04",		
        SUM(PAY_05) AS "pay05",		
        SUM(PAY_06) AS "pay06",		
        SUM(PAY_07) AS "pay07",		
        SUM(PAY_08) AS "pay08",		
        SUM(PAY_09) AS "pay09",		
        SUM(PAY_10) AS "pay10",		
        SUM(PAY_11) AS "pay11",		
        SUM(PAY_12) AS "pay12",
        
        MAX(COM01) AS "com01",
        MAX(COM02) AS "com02",
        MAX(COM03) AS "com03",
        MAX(COM04) AS "com04",
        MAX(COM05) AS "com05",
        MAX(COM06) AS "com06",
        MAX(COM07) AS "com07",
        MAX(COM08) AS "com08",
        MAX(COM09) AS "com09",
        MAX(COM10) AS "com10",
        MAX(COM11) AS "com11",
        MAX(COM12) AS "com12"
        
        
    FROM (		

    SELECT  A.STUDENT_ID,
            A.STUDENT_NO,
            A.KOREAN_NAME,
            A.ENTRANCE_DAY,
            A.ADMISSION_FEE,
            A.LAST_CLASS_ID,
            CASE WHEN MONTH(CURDATE()) >= 1 THEN FEE_01 ELSE NULL END AS FEE_01,
            CASE WHEN MONTH(CURDATE()) >= 2 THEN FEE_02 ELSE NULL END AS FEE_02,
            CASE WHEN MONTH(CURDATE()) >= 3 THEN FEE_03 ELSE NULL END AS FEE_03,
            CASE WHEN MONTH(CURDATE()) >= 4 THEN FEE_04 ELSE NULL END AS FEE_04,
            CASE WHEN MONTH(CURDATE()) >= 5 THEN FEE_05 ELSE NULL END AS FEE_05,
            CASE WHEN MONTH(CURDATE()) >= 6 THEN FEE_06 ELSE NULL END AS FEE_06,
            CASE WHEN MONTH(CURDATE()) >= 7 THEN FEE_07 ELSE NULL END AS FEE_07,
            CASE WHEN MONTH(CURDATE()) >= 8 THEN FEE_08 ELSE NULL END AS FEE_08,
            CASE WHEN MONTH(CURDATE()) >= 9 THEN FEE_09 ELSE NULL END AS FEE_09,
            CASE WHEN MONTH(CURDATE()) >= 10 THEN FEE_10 ELSE NULL END AS FEE_10,
            CASE WHEN MONTH(CURDATE()) >= 11 THEN FEE_11 ELSE NULL END AS FEE_11,
            CASE WHEN MONTH(CURDATE()) >= 12 THEN FEE_12 ELSE NULL END AS FEE_12,
            
            CASE WHEN MONTH(CURDATE()) >= 1 AND FEE_01 IS NOT NULL THEN PAY_01 ELSE NULL END AS PAY_01,
            CASE WHEN MONTH(CURDATE()) >= 2 AND FEE_02 IS NOT NULL THEN PAY_02 ELSE NULL END AS PAY_02,
            CASE WHEN MONTH(CURDATE()) >= 3 AND FEE_03 IS NOT NULL THEN PAY_03 ELSE NULL END AS PAY_03,
            CASE WHEN MONTH(CURDATE()) >= 4 AND FEE_04 IS NOT NULL THEN PAY_04 ELSE NULL END AS PAY_04,
            CASE WHEN MONTH(CURDATE()) >= 5 AND FEE_05 IS NOT NULL THEN PAY_05 ELSE NULL END AS PAY_05,
            CASE WHEN MONTH(CURDATE()) >= 6 AND FEE_06 IS NOT NULL THEN PAY_06 ELSE NULL END AS PAY_06,
            CASE WHEN MONTH(CURDATE()) >= 7 AND FEE_07 IS NOT NULL THEN PAY_07 ELSE NULL END AS PAY_07,
            CASE WHEN MONTH(CURDATE()) >= 8 AND FEE_08 IS NOT NULL THEN PAY_08 ELSE NULL END AS PAY_08,
            CASE WHEN MONTH(CURDATE()) >= 9 AND FEE_09 IS NOT NULL THEN PAY_09 ELSE NULL END AS PAY_09,
            CASE WHEN MONTH(CURDATE()) >= 10 AND FEE_10 IS NOT NULL THEN PAY_10 ELSE NULL END AS PAY_10,
            CASE WHEN MONTH(CURDATE()) >= 11 AND FEE_11 IS NOT NULL THEN PAY_11 ELSE NULL END AS PAY_11,
            CASE WHEN MONTH(CURDATE()) >= 12 AND FEE_12 IS NOT NULL THEN PAY_12 ELSE NULL END AS PAY_12,
            
            CASE WHEN MONTH(CURDATE()) >= 1 THEN COM01 ELSE 'X' END AS COM01,
            CASE WHEN MONTH(CURDATE()) >= 2 THEN COM02 ELSE 'X' END AS COM02,
            CASE WHEN MONTH(CURDATE()) >= 3 THEN COM03 ELSE 'X' END AS COM03,
            CASE WHEN MONTH(CURDATE()) >= 4 THEN COM04 ELSE 'X' END AS COM04,
            CASE WHEN MONTH(CURDATE()) >= 5 THEN COM05 ELSE 'X' END AS COM05,
            CASE WHEN MONTH(CURDATE()) >= 6 THEN COM06 ELSE 'X' END AS COM06,
            CASE WHEN MONTH(CURDATE()) >= 7 THEN COM07 ELSE 'X' END AS COM07,
            CASE WHEN MONTH(CURDATE()) >= 8 THEN COM08 ELSE 'X' END AS COM08,
            CASE WHEN MONTH(CURDATE()) >= 9 THEN COM09 ELSE 'X' END AS COM09,
            CASE WHEN MONTH(CURDATE()) >= 10 THEN COM10 ELSE 'X' END AS COM10,
            CASE WHEN MONTH(CURDATE()) >= 11 THEN COM11 ELSE 'X' END AS COM11,
            CASE WHEN MONTH(CURDATE()) >= 12 THEN COM12 ELSE 'X' END AS COM12
            
            

    FROM ( 
            SELECT A.STUDENT_ID,
                        A.STUDENT_NO,
                        A.KOREAN_NAME,
                        A.ENTRANCE_DAY,
                        A.ADMISSION_FEE,
                        A.LAST_CLASS_ID,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '01'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_01,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '02'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_02,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '03'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_03,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '04'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_04,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '05'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_05,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '06'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_06,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '07'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_07,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '08'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_08,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '09'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_09,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '10'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_10,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '11'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_11,

                (SELECT CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
                            WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
                            WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
                        ELSE 0 END
                FROM SCHOOL_FEE X
                WHERE X.APPLY_YEAR = '${req.query.applyYear}'
                AND X.APPLY_MONTH = '12'
                AND X.SEMESTER_ID = C.SEMESTER_ID) AS FEE_12,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '01'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_01,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '02'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_02,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '03'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_03,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '04'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_04,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '05'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_05,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '06'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_06,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '07'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_07,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '08'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_08,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '09'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_09,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '10'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_10,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '11'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_11,

                (SELECT X.SCHOOL_FEE
            FROM PAYMENT X
            WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
            AND X.PAYMENT_MONTH = '12'
            AND X.STUDENT_ID = A.STUDENT_ID
            AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_12, 
     
            CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','01','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','01','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','01','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','01','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM01,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','02','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','02','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','02','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','02','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM02,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','03','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','03','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','03','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','03','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM03,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','04','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T'  
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','04','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','04','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','04','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM04,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','05','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','05','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','05','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','05','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM05,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','06','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','06','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','06','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','06','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM06,
        
        CASE WHEN B.ABANDON_REASON IS NULL  AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','07','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','07','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','07','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','07','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM07,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','08','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','08','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','08','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','08','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM08,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','09','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T'  
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','09','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','09','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','09','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM09,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','10','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','10','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','10','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','10','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM10,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','11','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','11','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','11','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','11','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM11,
        
        CASE WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','12','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE) 
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','12','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(D.RECEIPT_END_DATE AS DATE)
                    THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE = B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','12','01') AS DATE)) BETWEEN CAST(D.RECEIPT_START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T' 
            WHEN B.ABANDON_REASON IS NOT NULL AND
                    D.START_DATE != B.START_DATE AND
                    LAST_DAY(CAST(CONCAT('${req.query.applyYear}','12','01') AS DATE)) BETWEEN CAST(B.START_DATE AS DATE) AND CAST(B.END_DATE AS DATE)
            THEN 'T'
            ELSE 'F' 
        END AS COM12
        
            FROM STUDENT_BASIC_INFO A
            LEFT OUTER JOIN CLASSINFO_STUDENTS B ON A.STUDENT_ID = B.STUDENT_ID
            LEFT OUTER JOIN CLASS_INFO C ON B.CLASS_ID = C.CLASS_ID
            LEFT OUTER JOIN SEMESTER D ON D.SEMESTER_ID = C.SEMESTER_ID
            WHERE 1=1
    ) A		
    ) A
    LEFT OUTER JOIN CLASS_INFO B ON B.CLASS_ID = A.LAST_CLASS_ID
    LEFT OUTER JOIN STUDENT_FAMILY C ON A.STUDENT_ID = C.STUDENT_ID
    LEFT OUTER JOIN TEACHER D ON B.TEACHER_ID = D.TEACHER_ID 
    LEFT OUTER JOIN COMMON_CODE C1 ON B.DEPARTMENT = C1.CODE AND C1.SUPER_CODE = 'DEPARTMENT'
    WHERE 1=1

    GROUP BY A.STUDENT_ID,
        A.STUDENT_NO,
        A.KOREAN_NAME,
        A.ENTRANCE_DAY,
        A.ADMISSION_FEE,
        A.LAST_CLASS_ID

    HAVING SUM(
        IFNULL(FEE_01,0) + 
        IFNULL(FEE_02,0) + 
        IFNULL(FEE_03,0) + 
        IFNULL(FEE_04,0) + 
        IFNULL(FEE_05,0) + 
        IFNULL(FEE_06,0) + 
        IFNULL(FEE_07,0) + 
        IFNULL(FEE_08,0) + 
        IFNULL(FEE_09,0) + 
        IFNULL(FEE_10,0) + 
        IFNULL(FEE_11,0) + 
        IFNULL(FEE_12,0)
        ) !=
        
        SUM(
        IFNULL(PAY_01,0) +		
        IFNULL(PAY_02,0) +
        IFNULL(PAY_03,0) +
        IFNULL(PAY_04,0) +		
        IFNULL(PAY_05,0) +	
        IFNULL(PAY_06,0) +		
        IFNULL(PAY_07,0) +		
        IFNULL(PAY_08,0) +	
        IFNULL(PAY_09,0) +	
        IFNULL(PAY_10,0) +	
        IFNULL(PAY_11,0) +	
        IFNULL(PAY_12,0) 
        )
`;

connection.query(sql,
    (err, rows, fields) => {
        if(err) {
            Log.print(`/api/defaulters/list failed . sql=${sql} error=${err}`);
            throw err;
        }

        try {                
            let results = [];
            for(let i=0; i < rows.length; i++){
                results.push(rows[i]);
            }
            res.send({"results": results});
            
            Log.print(`/api/defaulters/list called . sql=${sql} count=${rows.length}`);
        } catch (error) {
            Log.print(`/api/defaulters/list failed . sql=${sql} error=${error}`);
        }
    }
);
};

const fs = require('fs');
const excel = fs.readFileSync('./excel.json');
const excelConf = JSON.parse(excel);
const fse = require('fs-extra');
const Excel = require('exceljs');

/**
* 미납자 명단
*/
defaulterListExcel = async (req, res) => {
try {
    let results = JSON.parse(req.body.results);
    let defaulter = `${excelConf.excelDir}${excelConf.defaulterDir}미납자명단${excelConf.defaulterExt}`;
    fse.copySync(`${excelConf.templateDir}${excelConf.defaulter}`, defaulter);
    await makeDefaulterList(results, defaulter);
    res.send({"result": "success"});
 } catch (error) {
    Log.error(`/api/defaulters/list failed error=${error}`);
    res.send({"result": "failed"});
 }
}//defaulterListExcel


var DEFAULTERS;
getDefaulters = () => {
return DEFAULTERS;
}
setDefaulters = (results) => {
    DEFAULTERS = results;
}

/**
* 엑셀변환
*/
makeDefaulterList = async (results, targetFile) => {    
try {
    setDefaulters(results);
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(targetFile)
    .then(function() {
        let worksheet = workbook.getWorksheet('data');
        results = getDefaulters();
        let applyYear;
        for(let i=0; i<results.length; i++){
            let index = i + 1;
            let result = results[i];
            worksheet.getCell(`A${index}`).value = result.studentNo;
            worksheet.getCell(`B${index}`).value = result.studentName;
            worksheet.getCell(`C${index}`).value = result.department + ' ' + result.className;
            worksheet.getCell(`D${index}`).value = result.teacher;

            worksheet.getCell(`E${index}`).value = result.father;
            worksheet.getCell(`F${index}`).value = result.fatherPhoneNo;
            worksheet.getCell(`G${index}`).value = result.mother;
            worksheet.getCell(`H${index}`).value = result.motherPhoneNo;

            worksheet.getCell(`I${index}`).value = result.totalFee;
            worksheet.getCell(`J${index}`).value = result.totalPay;
            worksheet.getCell(`K${index}`).value = result.totalBalance;
            //○  ●
            if(result.com01 === "T" && result.fee01 === result.pay01){
                worksheet.getCell(`L${index}`).value = "●";
            }else if(result.com01 === "T" && result.fee01 !== result.pay01){
                worksheet.getCell(`L${index}`).value = "○";
            }
            if(result.com02 === "T" && result.fee02 === result.pay02){
                worksheet.getCell(`M${index}`).value = "●";
            }else if(result.com02 === "T" && result.fee02 !== result.pay02){
                worksheet.getCell(`M${index}`).value = "○";
            }
            if(result.com03 === "T" && result.fee03 === result.pay03){
                worksheet.getCell(`N${index}`).value = "●";
            }else if(result.com03 === "T" && result.fee03 !== result.pay03){
                worksheet.getCell(`N${index}`).value = "○";
            }
            if(result.com04 === "T" && result.fee04 === result.pay04){
                worksheet.getCell(`O${index}`).value = "●";
            }else if(result.com04 === "T" && result.fee04 !== result.pay04){
                worksheet.getCell(`O${index}`).value = "○";
            }
            if(result.com05 === "T" && result.fee05 === result.pay05){
                worksheet.getCell(`P${index}`).value = "●";
            }else if(result.com05 === "T" && result.fee05 !== result.pay05){
                worksheet.getCell(`P${index}`).value = "○";
            }
            if(result.com06 === "T" && result.fee06 === result.pay06){
                worksheet.getCell(`Q${index}`).value = "●";
            }else if(result.com06 === "T" && result.fee06 !== result.pay06){
                worksheet.getCell(`Q${index}`).value = "○";
            }
            if(result.com07 === "T" && result.fee07 === result.pay07){
                worksheet.getCell(`R${index}`).value = "●";
            }else if(result.com07 === "T" && result.fee07 !== result.pay07){
                worksheet.getCell(`R${index}`).value = "○";
            }
            if(result.com08 === "T" && result.fee08 === result.pay08){
                worksheet.getCell(`S${index}`).value = "●";
            }else if(result.com08 === "T" && result.fee08 !== result.pay08){
                worksheet.getCell(`S${index}`).value = "○";
            }
            if(result.com09 === "T" && result.fee09 === result.pay09){
                worksheet.getCell(`T${index}`).value = "●";
            }else if(result.com09 === "T" && result.fee09 !== result.pay09){
                worksheet.getCell(`T${index}`).value = "○";
            }
            if(result.com10 === "T" && result.fee10 === result.pay10){
                worksheet.getCell(`U${index}`).value = "●";
            }else if(result.com10 === "T" && result.fee10 !== result.pay10){
                worksheet.getCell(`U${index}`).value = "○";
            }
            if(result.com11 === "T" && result.fee11 === result.pay11){
                worksheet.getCell(`V${index}`).value = "●";
            }else if(result.com11 === "T" && result.fee11 !== result.pay11){
                worksheet.getCell(`V${index}`).value = "○";
            }
            if(result.com12 === "T" && result.fee12 === result.pay12){
                worksheet.getCell(`W${index}`).value = "●";
            }else if(result.com12 === "T" && result.fee12 !== result.pay12){
                worksheet.getCell(`W${index}`).value = "○";
            }   
            applyYear = result.applyYear;         
        }//for      
        worksheet.getCell(`X1`).value = `${applyYear}년도 미납자 명단`;      

    })
    .catch(err => {Log.error(err)});
    await workbook.xlsx.writeFile(targetFile);  
} catch (error) {
    Log.error(`/api/defaulters/list failed error=${error}`);
}
}//defaulterList

module.exports = {
    defaulterList,
    defaulterListExcel
}