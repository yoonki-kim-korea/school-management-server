const Log = require('../../utils/debug.js');

/**
 * 학기별 학급 인원 현황
 */    
semesterPersonalList = (req, res, connection) => { 
    
    let sql = ` 
    SELECT  0 AS "id", 
            0 AS "sid", 
            A.DEPARTMENT AS "department", 
            A.CLASS_NAME AS "className", 
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'STD' AND A.ABANDON_REASON IS NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "stdCnt",
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'LEV' THEN 1 ELSE 0 END) AS UNSIGNED) AS "levCnt",
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'GRD' THEN 1 ELSE 0 END) AS UNSIGNED) AS "grdCnt",
			CAST(SUM(CASE WHEN A.ABANDON_REASON IS NOT NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "abandonCnt",
			CAST(SUM(CASE WHEN A.ABANDON_REASON IS NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "currentCnt",
			COUNT(*) AS "total"
	FROM (
		SELECT C1.CODE_NAME AS DEPARTMENT, D.CLASS_NAME, C.STUDENT_STATUS, A.ABANDON_REASON
		FROM CLASSINFO_STUDENTS A 

		LEFT OUTER JOIN STUDENT_BASIC_INFO B
		ON A.STUDENT_ID = B.STUDENT_ID

		LEFT OUTER JOIN STUDENT_HISTORY C
		ON A.STUDENT_ID = C.STUDENT_ID
		AND B.LAST_HISTORY_SEQ = C.HISTORY_SEQ

		LEFT OUTER JOIN CLASS_INFO D 
		ON A.CLASS_ID = D.CLASS_ID
		
		LEFT OUTER JOIN COMMON_CODE C1
		ON C1.SUPER_CODE = 'DEPARTMENT'
		AND C1.CODE = D.DEPARTMENT

		WHERE 1=1
        AND D.SEMESTER_ID = '${req.query.semesterId}'        
`;
if(req.query.department) {
    sql += `		AND D.DEPARTMENT = '${req.query.department}'`;
}
sql += `
	) A
	GROUP BY DEPARTMENT, CLASS_NAME

	UNION 

    SELECT  0 AS "id", 
            1 AS "sid", 
            A.DEPARTMENT AS "department", 
            '소계'  AS "className", 
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'STD' AND A.ABANDON_REASON IS NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "stdCnt",
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'LEV' THEN 1 ELSE 0 END) AS UNSIGNED) AS "levCnt",
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'GRD' THEN 1 ELSE 0 END) AS UNSIGNED) AS "grdCnt",
			CAST(SUM(CASE WHEN A.ABANDON_REASON IS NOT NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "abandonCnt",
			CAST(SUM(CASE WHEN A.ABANDON_REASON IS NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "currentCnt",
			COUNT(*) AS "total"
	FROM (
		SELECT C1.CODE_NAME AS DEPARTMENT, D.CLASS_NAME, C.STUDENT_STATUS, A.ABANDON_REASON
		FROM CLASSINFO_STUDENTS A 

		LEFT OUTER JOIN STUDENT_BASIC_INFO B
		ON A.STUDENT_ID = B.STUDENT_ID

		LEFT OUTER JOIN STUDENT_HISTORY C
		ON A.STUDENT_ID = C.STUDENT_ID
		AND B.LAST_HISTORY_SEQ = C.HISTORY_SEQ

		LEFT OUTER JOIN CLASS_INFO D 
		ON A.CLASS_ID = D.CLASS_ID
		
		LEFT OUTER JOIN COMMON_CODE C1
		ON C1.SUPER_CODE = 'DEPARTMENT'
		AND C1.CODE = D.DEPARTMENT
		
		LEFT OUTER JOIN COMMON_CODE C2
		ON C2.SUPER_CODE = 'STUDENT_STATUS'
		AND C2.CODE = C.STUDENT_STATUS

		WHERE 1=1
		AND D.SEMESTER_ID = '${req.query.semesterId}'       
        `;
        if(req.query.department) {
            sql += `		AND D.DEPARTMENT = '${req.query.department}'`;
        }
        sql += `
	) A
	GROUP BY DEPARTMENT

	UNION 

    SELECT  1 AS "id",
            3 AS "sid", 
            '전체' AS "department", 
            ''  AS "className", 
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'STD' AND A.ABANDON_REASON IS NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "stdCnt",
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'LEV' THEN 1 ELSE 0 END) AS UNSIGNED) AS "levCnt",
		    CAST(SUM(CASE WHEN A.STUDENT_STATUS = 'GRD' THEN 1 ELSE 0 END) AS UNSIGNED) AS "grdCnt",
			CAST(SUM(CASE WHEN A.ABANDON_REASON IS NOT NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "abandonCnt",
			CAST(SUM(CASE WHEN A.ABANDON_REASON IS NULL THEN 1 ELSE 0 END) AS UNSIGNED) AS "currentCnt",
			COUNT(*) AS "total"
	FROM (
		SELECT C1.CODE_NAME AS DEPARTMENT, D.CLASS_NAME, C.STUDENT_STATUS, A.ABANDON_REASON
		FROM CLASSINFO_STUDENTS A 

		LEFT OUTER JOIN STUDENT_BASIC_INFO B
		ON A.STUDENT_ID = B.STUDENT_ID

		LEFT OUTER JOIN STUDENT_HISTORY C
		ON A.STUDENT_ID = C.STUDENT_ID
		AND B.LAST_HISTORY_SEQ = C.HISTORY_SEQ

		LEFT OUTER JOIN CLASS_INFO D 
		ON A.CLASS_ID = D.CLASS_ID
		
		LEFT OUTER JOIN COMMON_CODE C1
		ON C1.SUPER_CODE = 'DEPARTMENT'
		AND C1.CODE = D.DEPARTMENT
		
		LEFT OUTER JOIN COMMON_CODE C2
		ON C2.SUPER_CODE = 'STUDENT_STATUS'
		AND C2.CODE = C.STUDENT_STATUS

		WHERE 1=1
		AND D.SEMESTER_ID = '${req.query.semesterId}'       
        `;
        if(req.query.department) {
            sql += `		AND D.DEPARTMENT = '${req.query.department}'`;
        }
        sql += `
	) A

ORDER BY ID, DEPARTMENT, SID, className
    `;

    connection.query(sql,
        (err, rows, fields) => {
			if(err){
                Log.error(`/api/stats/semester/personal/list failed. sql=${sql}, error=${err}`);
                res.send({"results": []});
			}else{             
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
				Log.print(`/api/stats/semester/personal/list called  sql=${sql}`);
                res.send({"results": results});
			}
        }
    );
}//semesterPersonalList

module.exports = {
    semesterPersonalList
}