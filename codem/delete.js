const Log = require('../utils/debug.js');
/**
 * 슈퍼공통코드 삭제
 */
superCodeDelete = (req, res, connection) => {
    let sql = `
    UPDATE SUPER_COMMON_CODE 
    SET USE_YN = 'N',
        UDT_ID =           '${req.body.udpId}' ,
        UDT_DTM = NOW()        
   WHERE SUPER_CODE_ID = ${req.body.superCodeId} ;

   UPDATE COMMON_CODE 
   SET USE_YN = 'N',
       UDT_ID =           '${req.body.udpId}' ,
       UDT_DTM = NOW()        
   WHERE SUPER_CODE_ID = ${req.body.superCodeId} ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/codem/super/delete failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/codem/super/delete called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
};//superCodeDelete

/**
 * 공통코드 삭제
 */
codeDelete = (req, res, connection) => { 
    let sql = `
    UPDATE COMMON_CODE 
       SET USE_YN = 'N',
           UDT_ID = '${req.body.udpId}' ,
           UDT_DTM = NOW()        
     WHERE CODE_ID = ${req.body.codeId}
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/codem/code/delete failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/codem/code/delete called. sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
};//codeDelete

module.exports = {
    superCodeDelete,
    codeDelete
}
