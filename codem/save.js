const Log = require('../utils/debug.js');
/**
 * 슈퍼코드 저장
 */
superCodeSave = (req, res, connection) => { 

    let sql = `
    INSERT INTO SUPER_COMMON_CODE (
        SUPER_CODE_ID,
        SUPER_CODE,
        SUPER_CODE_NAME,
        WELL_ORDER,
        USE_YN,
        CRE_ID,
        CRE_DTM        
    ) SELECT MAX(SUPER_CODE_ID) + 1,
             '${req.body.superCode}' ,
             '${req.body.superCodeName}' ,
    `;
    
    if(!!req.body.wellOrder){
        sql += ` ${req.body.wellOrder} , `;
    }else{
        sql  += ` MAX(WELL_ORDER), `;
    }

    sql += `  
             'Y' ,
             '${req.body.creId}' ,
             NOW()
    FROM SUPER_COMMON_CODE
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/codem/super/save failed. sql=${sql} err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                
                Log.print(`/api/codem/super/save called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
};//superCodeSave

/**
 * 공통코드 저장
 */
codeSave = (req, res, connection) => { 
    
    let sql = `
    INSERT INTO COMMON_CODE (
        SUPER_CODE_ID,
        SUPER_CODE,
        CODE_ID,
        CODE,
        CODE_NAME,
        WELL_ORDER,
        USE_YN,
        CRE_ID,
        CRE_DTM        
    ) SELECT  ${req.body.superCodeId} ,
             '${req.body.superCode}' ,
             MAX(CODE_ID) + 1 ,
             '${req.body.code}' ,
             '${req.body.codeName}' ,
              ${!req.body.wellOrder ? 'MAX(WELL_ORDER)+1' : req.body.wellOrder} ,
             'Y' ,
             '${req.body.creId}' ,
             NOW()
      FROM COMMON_CODE
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/codem/code/save failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/codem/code/save called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
};//codeSave

module.exports = {
    superCodeSave,
    codeSave
}
