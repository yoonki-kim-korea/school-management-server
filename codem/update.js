const Log = require('../utils/debug.js');

/**
 * 슈퍼공통코드 수정
 */
superCodeUpdate = (req, res, connection) => { 

    let sql = `
    UPDATE SUPER_COMMON_CODE 
       SET SUPER_CODE =       '${req.body.superCode}',
           SUPER_CODE_NAME =  '${req.body.superCodeName}',
           WELL_ORDER =        ${req.body.wellOrder},
           UDT_ID =           '${req.body.udpId}' ,
           UDT_DTM = NOW()        
     WHERE SUPER_CODE_ID = ${req.body.superCodeId} ;

   UPDATE COMMON_CODE 
      SET SUPER_CODE = '${req.body.superCode}',
          UDT_ID =     '${req.body.udpId}' ,
          UDT_DTM = NOW()        
    WHERE SUPER_CODE_ID = ${req.body.superCodeId} ;
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/codem/super/update failed sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/codem/super/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
};//superCodeUpdate

/**
 * 공통코드 수정
 */
codeUpdate = (req, res, connection) => { 
    
    let sql = `
    UPDATE COMMON_CODE 
       SET CODE =       '${req.body.code}',
           CODE_NAME =  '${req.body.codeName}',
           WELL_ORDER =  ${req.body.wellOrder},
           UDT_ID =     '${req.body.udpId}' ,
           UDT_DTM =     NOW()        
     WHERE CODE_ID =     ${req.body.codeId}
    `;

    connection.query(sql, [], 
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/codem/code/update failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/codem/code/update called. sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
};//codeUpdate

module.exports = {
    superCodeUpdate,
    codeUpdate
}
