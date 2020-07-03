const Log = require('../utils/debug.js');

/**
 * 학생상태 목록 조회
 */    
studentStatusList = (req, res, connection) => { 
    
    let sql = `
    SELECT  A.STUDENT_ID AS "studentId", 
            A.STUDENT_NO AS "studentNo",
            A.KOREAN_NAME AS "koreanName",
            A.GERMAN_NAME AS "germanName",
            A.ENTRANCE_DAY AS "entranceDay",
            A.GRADUATE_DAY AS "graduateDay",
            A.STUDENT_STATUS AS "studentStatus",
            A.STUDENT_STATUS_NAME AS "studentStatusName",
            CASE WHEN A.STUDENT_STATUS = 'STD' THEN '' ELSE A.INPUT_DATE END AS "inputDate",
            A.ADMISSION_FEE AS "admissionFee",
            A.REDUCTION_TYPE AS "reductionType",
            A.REDUCTION_TYPE_NAME AS "reductionTypeName",
            A.SEMESTER_ID AS "semesterId",
            A.SEMESTER_NAME AS "semesterName",
            A.DEPARTMENT AS "department",
            A.DEPARTMENT_NAME AS "departmentName",
            A.CLASS_NAME AS "className",
            A.GRADE AS "grade",
            A.GRADE_NAME AS "gradeName",
            A.CLASS_NO AS "classNo",
            A.SCHOOLFEE_TYPE AS "schoolfeeType",
            A.SCHOOLFEE_TYPE_NAME AS "schoolfeeTypeName",
            A.CLASS_ID AS "classId",
            A.BIRTHDAY AS "birthday",
            A.FATHER_NAME AS "fatherName",
            A.FATHER_NAME_ENG AS "fatherNameEng",
            A.MOTHER_NAME AS "motherName",
            A.MOTHER_NAME_ENG AS "motherNameEng",
            B.BALANCE AS "balance",
            A.ADDRESS_CITY AS "addressCity",
            A.ADDRESS_DTL AS "addressDtl",
            A.PLZ AS "plz",
            A.GENDER AS "gender",
            A.GENDER_NAME AS "genderName"
    FROM (
        SELECT A.STUDENT_ID,
                A.STUDENT_NO,
                A.KOREAN_NAME,
                A.GERMAN_NAME,
                A.ENTRANCE_DAY,
                A.GRADUATE_DAY,
                G.STUDENT_STATUS,
                A.ADMISSION_FEE,
                C1.CODE_NAME AS STUDENT_STATUS_NAME,
                B.REDUCTION_TYPE,
                C2.CODE_NAME AS REDUCTION_TYPE_NAME,
                C.SEMESTER_ID,
                D.SEMESTER_NAME,
                C.DEPARTMENT,
                C4.CODE_NAME AS DEPARTMENT_NAME,
                C.CLASS_NAME,
                C.GRADE,
                C5.CODE_NAME AS GRADE_NAME,
                C.CLASS_NO,
                C.SCHOOLFEE_TYPE,
                C3.CODE_NAME AS SCHOOLFEE_TYPE_NAME,
                C.CLASS_ID,
                A.BIRTHDAY,
                H.FATHER_NAME,
                H.FATHER_NAME_ENG,
                H.MOTHER_NAME,
                H.MOTHER_NAME_ENG,
                G.INPUT_DATE,
                A.ADDRESS_CITY,
                A.ADDRESS_DTL,
                A.PLZ,
                A.GENDER,
                C6.CODE_NAME AS GENDER_NAME
                    
        FROM STUDENT_BASIC_INFO A
        LEFT OUTER JOIN STUDENT_FAMILY H ON A.STUDENT_ID = H.STUDENT_ID
        LEFT OUTER JOIN CLASSINFO_STUDENTS B ON A.STUDENT_ID = B.STUDENT_ID AND A.LAST_CLASS_ID = B.CLASS_ID
        LEFT OUTER JOIN CLASS_INFO C ON B.CLASS_ID = C.CLASS_ID AND A.LAST_CLASS_ID = C.CLASS_ID
        LEFT OUTER JOIN SEMESTER D ON D.SEMESTER_ID = C.SEMESTER_ID
        LEFT OUTER JOIN TEACHER E ON C.TEACHER_ID = E.TEACHER_ID
        LEFT OUTER JOIN STUDENT_HISTORY G ON A.STUDENT_ID = G.STUDENT_ID AND A.LAST_HISTORY_SEQ = G.HISTORY_SEQ

        LEFT OUTER JOIN COMMON_CODE C1 ON C1.SUPER_CODE = 'STUDENT_STATUS' AND C1.CODE = G.STUDENT_STATUS
        LEFT OUTER JOIN COMMON_CODE C2 ON C2.SUPER_CODE = 'REDUCTION_TYPE' AND C2.CODE = B.REDUCTION_TYPE
        LEFT OUTER JOIN COMMON_CODE C3 ON C3.SUPER_CODE = 'SCHOOLFEE_TYPE' AND C3.CODE = C.SCHOOLFEE_TYPE
        LEFT OUTER JOIN COMMON_CODE C4 ON C4.SUPER_CODE = 'DEPARTMENT' AND C4.CODE = C.DEPARTMENT
        LEFT OUTER JOIN COMMON_CODE C5 ON C5.SUPER_CODE = 'GRADE' AND C5.CODE = C.GRADE
        LEFT OUTER JOIN COMMON_CODE C6 ON C6.SUPER_CODE = 'GENDER' AND C6.CODE = A.GENDER
        WHERE 1=1
    `;
  
    if(!!req.query.studentStatus) {
        sql += "\n" + `AND G.STUDENT_STATUS = '${req.query.studentStatus}'`; 
    }  
    if(!!req.query.teacherId) {
        sql += "\n" + `AND C.TEACHER_ID = '${req.query.teacherId}'`; 
    }
    if(!!req.query.studentNo) {
        sql += "\n" + `AND A.STUDENT_NO = '${req.query.studentNo}'`; 
    }
    if(!!req.query.grade) {
        sql += "\n" + `AND C.GRADE = '${req.query.grade}'`; 
    }
    if(!!req.query.studentName) {
        sql += "\n" + `AND A.KOREAN_NAME LIKE '${req.query.studentName}%'`; 
    }
    if(!!req.query.classNo) {
        sql += "\n" + `AND C.CLASS_NO = '${req.query.classNo}'`; 
    }
    if(!!req.query.department) {
        sql += "\n" + `AND C.DEPARTMENT = '${req.query.department}'`; 
    }
    if(!!req.query.semesterId) {
        sql += "\n" + `AND C.SEMESTER_ID = '${req.query.semesterId}'`; 
    }

    sql += ` 
    ) A  
    LEFT OUTER JOIN (
    	SELECT A.STUDENT_ID  ,
			CAST(SUM(IFNULL(FEE,0) - IFNULL(PAY,0)) AS CHAR) AS BALANCE
	FROM (
			 SELECT A.STUDENT_ID,
							(SELECT SUM(CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
															WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
															WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
															WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
															WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
															WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
															ELSE 0 END)
							FROM SCHOOL_FEE X
							WHERE X.APPLY_YEAR = '${req.query.applyYear}'
							AND CAST(X.APPLY_MONTH AS UNSIGNED) >= (CASE WHEN DATE(A.ENTRANCE_DAY) <= DATE('${req.query.today}') THEN 1
																													ELSE CAST(MONTH(A.ENTRANCE_DAY) AS UNSIGNED)
																											END)
							AND CAST(X.APPLY_MONTH AS UNSIGNED) <= MONTH(NOW()) ) AS FEE,

							(SELECT COUNT(CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
															WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
															WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
															WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
															WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
															WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
															ELSE 0 END)
							FROM SCHOOL_FEE X
							WHERE X.APPLY_YEAR = '${req.query.applyYear}'

							AND CAST(X.APPLY_MONTH AS UNSIGNED) >=  (CASE WHEN DATE(A.ENTRANCE_DAY) <= DATE('${req.query.today}') THEN 1
																													ELSE CAST(MONTH(A.ENTRANCE_DAY)  AS UNSIGNED)
																											END)
							AND CAST(X.APPLY_MONTH AS UNSIGNED) <= MONTH(NOW()) ) AS FEE_MONTHS,

							(SELECT SUM(X.SCHOOL_FEE)
						   FROM PAYMENT X
						  WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
								AND CAST(X.PAYMENT_MONTH AS UNSIGNED) <= MONTH(NOW())
								AND X.STUDENT_ID = A.STUDENT_ID
								AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY,

							(SELECT COUNT(X.SCHOOL_FEE)
						   FROM PAYMENT X
						  WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
								AND CAST(X.PAYMENT_MONTH AS UNSIGNED) <= MONTH(NOW())
								AND X.STUDENT_ID = A.STUDENT_ID
								AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY_MONTHS,

									(SELECT SUM(CASE WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'NA' THEN REGULAR_SCHOOL_FEE
																	 WHEN C.SCHOOLFEE_TYPE = 'RE' AND B.REDUCTION_TYPE = 'MC' THEN REGULAR_SCHOOL_FEE_DISCOUNT
																	 ELSE 0 END)
									   FROM SCHOOL_FEE X
									  WHERE X.APPLY_YEAR = '${req.query.applyYear}'
											AND CAST(X.APPLY_MONTH AS UNSIGNED) >= (CASE WHEN DATE(A.ENTRANCE_DAY) <= DATE('${req.query.today}') THEN 1
																															 ELSE CAST(MONTH(A.ENTRANCE_DAY) AS UNSIGNED)
																													END)
											AND CAST(X.APPLY_MONTH AS UNSIGNED) <= MONTH(NOW()) ) AS FEE1,


									(SELECT SUM(CASE WHEN X.SCHOOL_FEE_TYPE = 'RE' THEN X.SCHOOL_FEE ELSE 0 END)
							   FROM PAYMENT X
							  WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
											AND CAST(X.PAYMENT_MONTH AS UNSIGNED) <= MONTH(NOW())
											AND X.STUDENT_ID = A.STUDENT_ID
											AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY1,

									(SELECT SUM(CASE   WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE1
																	   WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'NA' THEN EXTRA_SCHOOL_FEE2
																	  WHEN C.SCHOOLFEE_TYPE = 'E1' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE1_DISCOUNT
																	   WHEN C.SCHOOLFEE_TYPE = 'E2' AND B.REDUCTION_TYPE = 'MC' THEN EXTRA_SCHOOL_FEE2_DISCOUNT
																	   ELSE 0 END)
									   FROM SCHOOL_FEE X
									  WHERE X.APPLY_YEAR = '${req.query.applyYear}'
											AND CAST(X.APPLY_MONTH AS UNSIGNED) >= (CASE WHEN DATE(A.ENTRANCE_DAY) <= DATE('${req.query.today}') THEN 1
																															 ELSE CAST(MONTH(A.ENTRANCE_DAY) AS UNSIGNED)
																													END)
											AND CAST(X.APPLY_MONTH AS UNSIGNED) <= MONTH(NOW()) ) AS FEE2,


									(SELECT SUM(CASE WHEN X.SCHOOL_FEE_TYPE != 'RE' THEN X.SCHOOL_FEE ELSE 0 END)
							   FROM PAYMENT X
							  WHERE X.PAYMENT_YEAR = '${req.query.applyYear}'
											AND CAST(X.PAYMENT_MONTH AS UNSIGNED) <= MONTH(NOW())
											AND X.STUDENT_ID = A.STUDENT_ID
											AND X.SCHOOL_FEE_TYPE = C.SCHOOLFEE_TYPE) AS PAY2

			FROM STUDENT_BASIC_INFO A
			LEFT OUTER JOIN CLASSINFO_STUDENTS B ON A.STUDENT_ID = B.STUDENT_ID
			LEFT OUTER JOIN CLASS_INFO C ON B.CLASS_ID = C.CLASS_ID
			WHERE 1=1
	) A
	GROUP BY A.STUDENT_ID
    ) B
    ON A.STUDENT_ID = B.STUDENT_ID
    ORDER BY A.KOREAN_NAME, A.SCHOOLFEE_TYPE
    `; 
    
    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/student/status/list failed. sql=${sql}, error=${err}`);
                res.send({"results": []});
            }else{             
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/student/status/list called  sql=${sql}`);
                res.send({"results": results});
            }
        }
    );
}//studentStatusList

module.exports = {
    studentStatusList
}