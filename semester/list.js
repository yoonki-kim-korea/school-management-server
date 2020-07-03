const Log = require('../utils/debug.js');

/**
 * 화면에서 필요한 공통코드 목록 조회
 */    
semesterList = (req, res, connection) => { 
    
    let sql = `
    SELECT SEMESTER_ID AS "semesterId",
           SEMESTER_NAME AS "semesterName",
           START_DATE AS "startDate",
           END_DATE AS "endDate",
           RECEIPT_START_DATE AS "receiptStartDate",
           RECEIPT_END_DATE AS "receiptEndDate",
           SCHOOL_DAYS_COUNT AS "schoolDaysCount"
    FROM SEMESTER 
    WHERE USE_YN = 'Y'
    `;

    if(!!req.query.semesterYear) {
        sql += "\n" + `AND SEMESTER_ID LIKE '${req.query.semesterYear}_'`; 
    }

    if(!!req.query.semesterType) {
        sql += "\n" + `AND SEMESTER_ID LIKE '____${req.query.semesterType}'`; 
    }

    sql += `
    ORDER BY SEMESTER_ID DESC`;    

    Log.print(`/api/semester/list called  sql=${sql}`);

    connection.query(sql,
        (err, rows, fields) => {
            try {                
                let semesters = [];
                for(let i=0; i < rows.length; i++){
                    semesters.push(rows[i]);
                }
                res.send({"semesters": semesters});
            } catch (error) {
                Log.print(`공통코드 조회 실패. sql=${sql}, error=${error}`);
                res.send({"semesters": []});
            }
        }
    );
}//semesterList

/**
 * 학기 등록 가능여부
 * Y : 등록가능
 * N : 등록불가
 */
semesterSaveValid = (req, res, connection) => { 
    
    let sql = `
    SELECT CASE WHEN COUNT(*) > 0 THEN 'N' ELSE 'Y' END AS "valid"
    FROM SEMESTER 
    WHERE USE_YN = 'Y'
    AND SEMESTER_ID = '${req.query.semesterYear + req.query.semesterType}'`;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/semester/save/valid failed. sql=${sql}, error=${err}`);
                res.send({"valid": "N"});
            }else{      
                Log.print(`/api/semester/save/valid called.  sql=${sql}`);    
                if(rows.length > 0){
                    res.send({"valid": rows[0].valid});
                }else{
                    res.send({"valid": "N"});
                }
            }
        }
    );
}//semesterSaveValid

/**
 * 학기 삭제 가능여부
 * Y : 등록가능
 * N : 등록불가
 */
semesterDeleteValid = (req, res, connection) => { 
    
    let sql = `
    SELECT CASE WHEN COUNT(*) > 0 THEN 'N' ELSE 'Y' END AS "valid"
    FROM CLASS_INFO 
    WHERE USE_YN = 'Y'
    AND SEMESTER_ID = '${req.query.semesterId}'`; 

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/semester/delete/valid failed. sql=${sql}, error=${err}`);
                res.send({"valid": "N"});
            }else{
                if(rows.length > 0){
                    Log.print(`/api/semester/delete/valid called. [1] return=${rows[0].valid} sql=${sql}`);
                    res.send({"valid": rows[0].valid});
                }else{
                    Log.print(`/api/semester/delete/valid called. [2] no return  sql=${sql}`);
                    res.send({"valid": "N"});
                }
            }
        }
    );
}//semesterDeleteValid

module.exports = {
    semesterList,
    semesterSaveValid,
    semesterDeleteValid
}