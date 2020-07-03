const Log = require('../utils/debug.js');

//학생일지 수정
updateDiary = (req, res, connection) => {
    let sql = `
    UPDATE DIARY 
    SET 
    `;
    if(!!req.body.content){
        sql += `
        CONTENT = '${req.body.content}',
        `;
    }
    sql += `
        UDT_ID =  '${req.body.udtId}',
        UDT_DTM = NOW()        
    WHERE DIARY_ID = ${req.body.diaryId}
    AND STUDENT_ID = ${req.body.studentId}   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/user/update failed. sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/user/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    updateDiary
}
