const Log = require('../utils/debug.js');

/**
 * 수업료 목록 조회
 */    
issuedNew = (req, res, connection) => { 
    
    let sql = `
    SELECT '${req.query.issuedDate}' AS "issuedDate",
           substring('${req.query.issuedDate}',1,4) AS "issuedYear",
           '${req.query.documentType}'  AS "documentType" ,
           CASE WHEN MAX(CAST(SEQ_NO AS UNSIGNED)) IS NULL THEN '0001' ELSE LPAD(MAX(CAST(SEQ_NO AS UNSIGNED)) + 1, 4, '0') END AS "seqNo"
        FROM ISSUED
        WHERE ISSUED_DATE = '${req.query.issuedDate}'
        AND DOCUMENT_TYPE = '${req.query.documentType}'
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/issued/new failed. sql=${sql}, error=${err}`);
                res.send({"results": []});
            }else{             
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/issued/new called  sql=${sql}`);
                res.send({"results": results});
            }
        }
    );
}//issuedNew

module.exports = {
    issuedNew
}