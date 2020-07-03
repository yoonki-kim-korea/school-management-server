const Log = require('../utils/debug.js');

//교사별 계약  저장
saveContact = (req, res, connection) => {     

    let sql = `
    INSERT INTO CONTACT (
        CONTACT_ID,
        TEACHER_ID,
        CONTACT_START_DATE,
        CONTACT_END_DATE,
        REAL_END_DATE,
        USE_YN,
        CRE_ID,
        CRE_DTM
    ) 
    SELECT CASE WHEN CONTACT_ID IS NULL THEN 0 ELSE MAX(CONTACT_ID)+1 END,
           '${req.body.teacherId}' ,
           '${req.body.contactStartDate}' ,
           '${req.body.contactEndDate}' ,
           '${req.body.realEndDate}' ,
           'Y',
           '${req.body.creId}' ,
           NOW()
    FROM CONTACT
    WHERE TEACHER_ID = '${req.body.teacherId}'
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/teacher/contact/save failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/teacher/contact/save called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    saveContact
}