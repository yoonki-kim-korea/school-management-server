const Log = require('../utils/debug.js');

/**
 * 문서 항목 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function issuedSave(issued, comment, studentId, creId, connection)  {
 
    let sql = `
    INSERT INTO ISSUED (
        ISSUED_DATE,
        DOCUMENT_TYPE,
        SEQ_NO,
        STUDENT_ID,
        ISSUED_COMMENT,
        CRE_ID,
        CRE_DTM
    ) VALUES (
        '${issued.issuedDate}' ,
        '${issued.documentType}' ,
        '${issued.seqNo}' ,
         ${studentId},
        '${comment}' ,
        '${creId}' ,
        NOW()
    )`;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/issued/save failed. sql=${sql}, error=${err}`);
                //res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/issued/save called. sql=${sql}`);
                //res.send({"result":"success"});
            }
        }
    );
}//issuedSave

module.exports = {
    issuedSave
}
