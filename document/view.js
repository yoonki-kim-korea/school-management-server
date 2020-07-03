const Log = require('../utils/debug.js');

/**
 * 문서정보 상세 조회
 */
documentInfo = (req, res, connection) => { 
    
    let sql = `
    SELECT  ITEM_ID AS "itemId",
            ITEM_VALUE AS "itemValue"     
    FROM DOCUMENT A
    LEFT OUTER JOIN COMMON_CODE B ON B.SUPER_CODE = 'DOCUMENT' AND B.CODE = A.DOCUMENT_ID
    WHERE DOCUMENT_ID = '${req.query.documentId}'
      AND A.USE_YN = 'Y'
      
    UNION
    
        SELECT  ITEM_ID AS "itemId",
            ITEM_VALUE AS "itemValue"
    FROM DOCUMENT A
    LEFT OUTER JOIN COMMON_CODE B ON B.SUPER_CODE = 'DOCUMENT' AND B.CODE = A.DOCUMENT_ID
    WHERE DOCUMENT_ID ='COMMON'
    AND A.USE_YN = 'Y' 
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/document/info failed. sql=${sql}, error=${err}`);
                res.send({"documents": []});
            }else{             
                let documents = [];
                for(let i=0; i < rows.length; i++){
                    documents.push(rows[i]);
                }
                Log.print(`/api/document/info called  sql=${sql}`);
                res.send({"documents": documents});
            }
        }
    );
}//documentInfo

/**
 * 문서 항목 조회
 */    
documentView = (req, res, connection) => { 
    
    let sql = `
    SELECT  DOCUMENT_ID AS "documentId",
            B.CODE_NAME AS "documentName",
            ITEM_ID AS "itemId",
            ITEM_NAME AS "itemName",
            ITEM_VALUE AS "itemValue"     
    FROM DOCUMENT A
    LEFT OUTER JOIN COMMON_CODE B ON B.SUPER_CODE = 'DOCUMENT' AND B.CODE = A.DOCUMENT_ID
    WHERE DOCUMENT_ID = '${req.query.documentId}'
      AND A.USE_YN = 'Y'
    ORDER BY ITEM_ID
    `; 

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/document/view failed. sql=${sql}, error=${err}`);
                res.send({"documents": []});
            }else{            
                let documents = [];
                for(let i=0; i < rows.length; i++){
                    documents.push(rows[i]);
                }
                Log.print(`/api/document/view called  sql=${sql}`);
                res.send({"documents": documents});
            }
        }
    );
}//documentView

/**
 * 중복검사
 */
documentDupl = (req, res, connection) => { 
    
    let sql = `
    SELECT  CASE WHEN COUNT(*) = 0 THEN 'Y' ELSE 'N' END AS RESULT 
    FROM DOCUMENT
    WHERE DOCUMENT_ID = '${req.query.documentId}'
      AND UPPER(ITEM_ID) = UPPER('${req.query.itemId}')
      AND USE_YN = 'Y'
    `;
    
    connection.query(sql,
        (err, rows, fields) => {
            if(err) {    
                Log.error(`/api/document/dupl failed. sql=${sql}, error=${err}`);
                res.send({"duplCheck": [{"RESULT":"N"}]});   
            } else {         
                let duplCheck = [];
                for(let i=0; i < rows.length; i++){
                    duplCheck.push(rows[i]);
                }
                Log.print(`/api/document/dupl called. sql=${sql} duplCheck=${duplCheck[0].RESULT}`);
                res.send({"duplCheck": duplCheck});
            }
        }
    );
}//documentDupl

module.exports = {
    documentInfo,
    documentView,
    documentDupl
}