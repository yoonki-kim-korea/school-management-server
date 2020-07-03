const Log = require('../utils/debug.js');

/**
 * 문서 항목 삭제
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function documentDelete(req, res, connection)  {
 
    let sql = `
    DELETE FROM  DOCUMENT 
    WHERE DOCUMENT_ID = '${req.body.documentId}'
      AND ITEM_ID = '${req.body.itemId}' 
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/document/delete failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/document/delete called. sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}//documentDelete

module.exports = {
    documentDelete
}
