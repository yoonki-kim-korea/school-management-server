const Log = require('../utils/debug.js');
/**
 * 슈퍼공통코드 목록 조회
 */    
superCodeList = (req, res, connection) => { 
 
    let superCode  = req.query.superCode;
    let superCodeId   = req.query.superCodeId;
    let superCodeName = req.query.superCodeName;    
     
    let sql = `
    SELECT SUPER_CODE_ID AS "superCodeId",
           SUPER_CODE AS "superCode",
           SUPER_CODE_NAME AS "superCodeName",
           WELL_ORDER AS "wellOrder"
    FROM SUPER_COMMON_CODE
    WHERE USE_YN = 'Y'
    `;
    
    if(!!superCode) {
        sql += "\n" + `AND SUPER_CODE = '${superCode}'`; 
    }    
    if(!!superCodeId) {
        sql += "\n" + `AND SUPER_CODE_ID = '${superCodeId}'`; 
    }    
    if(!!superCodeName) {
        sql += "\n" + `AND SUPER_CODE_NAME LIKE '${superCodeName}%'`; 
    }

    sql += `
    ORDER BY WELL_ORDER`;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/codem/superlist failed. sql=${sql}, error=${err}`);
                res.send({"superCodes": []});
            }else{                
                let superCodes = [];
                for(let i=0; i < rows.length; i++){
                    superCodes.push(rows[i]);
                }
                Log.print(`/api/codem/superlist called. superCode=${!!superCode}, superCodeName=${superCodeName} sql=${sql}`);
                res.send({"superCodes": superCodes});
            }
        }
    );
}    
//superCodeList
 
/**
 * 공통코드 목록 조회
 */    
codeList = (req, res, connection) => {     
    
    let sql = `
    SELECT A.CODE_ID AS "codeId",
           A.SUPER_CODE_ID AS "superCodeId",
           A.SUPER_CODE AS "superCode",
           B.SUPER_CODE_NAME  AS "superCodeName",
           A.CODE AS "code",
           A.CODE_NAME AS "codeName",
           A.WELL_ORDER AS "wellOrder"
    FROM COMMON_CODE A 
    
    INNER JOIN SUPER_COMMON_CODE B ON A.SUPER_CODE_ID = B.SUPER_CODE_ID
    WHERE A.USE_YN = 'Y'
    `;
    
    if(!!req.query.superCodeId) {
        sql += "\n" + `AND A.SUPER_CODE_ID = '${req.query.superCodeId}'`; 
    }
   
    if(!!req.query.code) {
        sql += "\n" + `AND A.CODE = '${req.query.code}'`; 
    } 

    if(!!req.query.codeName) {
        sql += "\n" + `AND A.CODE_NAME LIKE '${req.query.codeName}%'`; 
    }

    sql += `
    ORDER BY A.SUPER_CODE, A.WELL_ORDER`; 
    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/codem/list failed. sql=${sql}, error=${err}`);
                res.send({"codes": []});
            }else{        
                let codes = [];
                for(let i=0; i < rows.length; i++){
                    codes.push(rows[i]);
                }
                Log.print(`/api/codem/list called. superCodeId=${req.query.superCodeId}, code=${req.query.code},  codeName=${req.query.codeName}, sql=${sql}`);
                res.send({"codes": codes});
            }
        }
    );
} 

/**
 * 공통코드 중복 확인
 */    
codeDuplCheckList = (req, res, connection) => {     
    
    let sql = `
    SELECT CASE WHEN COUNT(*) = 0 THEN 'Y' ELSE 'N' END AS RESULT 
    FROM COMMON_CODE
    WHERE USE_YN = 'Y'
    AND SUPER_CODE = '${req.query.superCode}'
    AND UPPER(CODE) = UPPER('${req.query.code}')
    `;

    if(!!req.query.codeId){
        sql += ` CODE_ID = '${req.query.codeId}' `
    }

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/codem/dupl/list failed. sql=${sql}, error=${err}`);
                res.send({"duplCheck": [{"RESULT":"N"}]});
            }else{            
                let duplCheck = [];
                for(let i=0; i < rows.length; i++){
                    duplCheck.push(rows[i]);
                }                
                Log.print(`/api/codem/dupl/list called. sql=${sql} duplCheck=${duplCheck[0].RESULT}`);
                res.send({"duplCheck": duplCheck});
            }
        }
    );
}//codeDuplCheckList

/**
 * 슈퍼코드 중복검사
 */
superCodeDuplList = (req, res, connection) => {
    let sql = `
    SELECT CASE WHEN COUNT(*) = 0 THEN 'Y' ELSE 'N' END AS RESULT 
    FROM SUPER_COMMON_CODE
    WHERE USE_YN = 'Y'
    AND UPPER(SUPER_CODE) = UPPER('${req.query.superCode}')
    `;

    if(!!req.query.superCodeId){
        sql += ` AND SUPER_CODE_ID != ${req.query.superCodeId} `;
    }

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/codem/super/dupl/list failed. sql=${sql}, error=${err}`);
                res.send({"duplCheck": [{"RESULT":"N"}]});
            }else{               
                let duplCheck = [];
                for(let i=0; i < rows.length; i++){
                    duplCheck.push(rows[i]);
                }                
                Log.print(`/api/codem/super/dupl/list called.  sql=${sql}duplCheck=${duplCheck[0].RESULT}`);
                res.send({"duplCheck": duplCheck});
            }
        }
    );
}//superCodeDuplList

module.exports = {
    superCodeList,
    codeList,
    codeDuplCheckList,
    superCodeDuplList
}