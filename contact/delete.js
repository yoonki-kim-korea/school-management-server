const Log = require('../utils/debug.js');

//교사별 계약 삭제
deleteContact = (req, res, connection) => { 
    let sql = `    
    UPDATE CONTACT
    SET USE_YN = 'N',
        UDT_ID =  '${req.body.udtId}',
        UDT_DTM = NOW()        
    WHERE TEACHER_ID = ${req.body.teacherId}
    AND CONTACT_ID = ${req.body.contactId}   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/teacher/contact/delete failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/teacher/contact/delete called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    deleteContact
}
