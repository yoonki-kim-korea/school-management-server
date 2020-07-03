const Log = require('../utils/debug.js');

/**
 * 문서 항목 수정
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function documentUpdate(req, res, connection)  {
 
    let sql = `
    UPDATE DOCUMENT 
    SET ITEM_VALUE = '${req.body.itemValue}',
        UDT_ID = '${req.body.udtId}',
        UDT_DTM = NOW()
    WHERE DOCUMENT_ID = '${req.body.documentId}'
      AND ITEM_ID = '${req.body.itemId}' 
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/document/update failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/document/update called. sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}//documentUpdate

module.exports = {
    documentUpdate
}
