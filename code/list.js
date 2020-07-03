const Log = require('../utils/debug.js');

/**
 * 화면에서 필요한 공통코드 목록 조회
 */    
codeList = (req, res, connection) => { 
 
    let superCode  = req.query.superCode;
    let code        = req.query.code;
    let codeName = req.query.codeName;

    let sql = `
    SELECT B.CODE AS "key",
           B.CODE_NAME AS "value"
    FROM SUPER_COMMON_CODE A LEFT JOIN COMMON_CODE B
    ON A.SUPER_CODE_ID = B.SUPER_CODE_ID 
    WHERE 1=1
    AND A.USE_YN =  'Y' AND B.USE_YN = 'Y'
    `;
    
    if(!!superCode) {
        sql += "\n" + `AND A.SUPER_CODE = '${superCode}'`; 
    }    
    if(!!code) {
        sql += "\n" + `AND B.CODE = '${code}'`; 
    }    
    if(!!codeName) {
        sql += "\n" + `AND B.CODE_NAME LIKE '${codeName}%'`; 
    }

    sql += `
    ORDER BY A.SUPER_CODE, B.WELL_ORDER`;    

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/code/list failed. superCode=${superCode}, sql=${sql}, error=${err}`);
                res.send({"codes": []});
            }else{              
                let codes = [];
                for(let i=0; i < rows.length; i++){
                    codes.push(rows[i]);
                }
                Log.print(`/api/code/list called. superCode=${superCode}, sql=${sql}`);
                res.send({"codes": codes});
            }
        }
    );
}    
//공통코드 조회 끝

/**
 * 
 */
superCodeList = (req, res, connection) => { 

    let sql = `
    SELECT SUPER_CODE_ID AS "key",
           CONCAT('[', SUPER_CODE , '] ', SUPER_CODE_NAME)  AS "value"
    FROM SUPER_COMMON_CODE
    WHERE USE_YN = 'Y'
    ORDER BY WELL_ORDER
    `;

    connection.query(sql,
        (err, rows, fields) => {
            try {                
                let superCodes = [];
                for(let i=0; i < rows.length; i++){
                    superCodes.push(rows[i]);
                }
                Log.print(`/api/super/list called. sql=${sql}`);
                res.send({"superCodes": superCodes});
            } catch (error) {
                Log.print(`/api/super/list failed. sql=${sql}, error=${error}`);
                res.send({"superCodes": []});
            }
        }
    );
}    
//superCodeList

/**
 * 교사목록 조회
 */    
teacherList = (req, res, connection) => { 

    let sql = `
    SELECT TEACHER_ID AS "key",
           TEACHER_NAME AS "value"
    FROM TEACHER
    WHERE USE_YN = 'Y' 
    AND DUTY = 'TEACHER'
    `;

    connection.query(sql,
        (err, rows, fields) => {
            try {                
                let codes = [];
                for(let i=0; i < rows.length; i++){
                    codes.push(rows[i]);
                }
                Log.print(`/api/code/teacher/list called. sql=${sql}`);
                res.send({"codes": codes});
            } catch (error) {
                Log.print(`/api/code/teacher/list failed. sql=${sql}, error=${error}`);
                res.send({"codes": []});
            }
        }
    );
}    
//교사 조회 끝

/**
 * 학기 목록 조회
 */    
semesterList = (req, res, connection) => { 

    let sql = `
    SELECT SEMESTER_ID AS "key",
           SEMESTER_NAME AS "value"
      FROM SEMESTER
     WHERE USE_YN = 'Y'
    `;

    connection.query(sql,
        (err, rows, fields) => {
            try {                
                let codes = [];
                for(let i=0; i < rows.length; i++){
                    codes.push(rows[i]);
                }
                Log.print(`/api/semester/list called. sql=${sql}`);
                res.send({"codes": codes});
            } catch (error) {
                Log.print(`/api/semester/list failed. sql=${sql}, error=${error}`);
                res.send({"codes": []});
            }
        }
    );
}//semesterList  


/**
 * 학기 목록 조회
 */    
classroomList = (req, res, connection) => { 

    let sql = `
    SELECT CLASSROOM_ID AS "key",
    CLASSROOM_NAME AS "value"
      FROM CLASSROOM
     WHERE USE_YN = 'Y'
    `;

    connection.query(sql,
        (err, rows, fields) => {
            try {                
                let codes = [];
                for(let i=0; i < rows.length; i++){
                    codes.push(rows[i]);
                }
                Log.print(`/api/code/classroom/list called. sql=${sql}`);
                res.send({"codes": codes});
            } catch (error) {
                Log.print(`/api/code/classroom/list failed. sql=${sql}, error=${error}`);
                res.send({"codes": []});
            }
        }
    );
}//classroomList  

module.exports = {
    codeList,
    superCodeList,
    teacherList,
    semesterList,
    classroomList
}