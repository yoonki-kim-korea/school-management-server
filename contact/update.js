const Log = require('../utils/debug.js');

//교사별 계약 수정
updateContact = (req, res, connection) => {
    let sql = `    
    UPDATE CONTACT
    SET CONTACT_START_DATE =  '${req.body.contactStartDate}',
        CONTACT_END_DATE =  '${req.body.contactEndDate}',
        REAL_END_DATE =  '${req.body.realEndDate}',
        UDT_ID =  '${req.body.udtId}',
        UDT_DTM = NOW()        
    WHERE TEACHER_ID = ${req.body.teacherId}
    AND CONTACT_ID = ${req.body.contactId}   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/teacher/contact/update failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/teacher/contact/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    updateContact
}
