const Log = require('../utils/debug.js');

//학생일지 삭제
deleteDiary = (req, res, connection) => { 
    let sql = `    
    UPDATE DIARY 
    SET USE_YN = 'N',
        UDT_ID =  '${req.body.udtId}',
        UDT_DTM = NOW()        
    WHERE DIARY_ID = ${req.body.diaryId}
    AND STUDENT_ID = ${req.body.studentId}   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/user/delete failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/user/delete called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    deleteDiary
}
