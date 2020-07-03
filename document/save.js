const Log = require('../utils/debug.js');

/**
 * 문서 항목 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function documentSave(req, res, connection)  {
 
    let sql = `
    INSERT INTO DOCUMENT (
        DOCUMENT_ID,
        ITEM_ID,
        ITEM_NAME,
        ITEM_VALUE,
        USE_YN,        
        CRE_ID,
        CRE_DTM
    ) VALUES (
        '${req.body.documentId}' ,
        '${req.body.itemId}' ,
        '${req.body.itemName}' ,
        '${req.body.itemValue}' ,
        'Y' ,
        '${req.body.creId}' ,
        NOW()
    )`;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/document/save failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/document/save called. sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}//documentSave

module.exports = {
    documentSave
}
