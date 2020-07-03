const Log = require('../utils/debug.js');

//학생일지 저장
saveDiary = (req, res, connection) => {     

    let sql = `
    INSERT INTO DIARY (
        DIARY_ID,
        STUDENT_ID,
        CONTENT,
        USE_YN,
        CRE_ID,
        CRE_DTM
    ) SELECT
        CASE WHEN DIARY_ID IS NULL THEN 0 ELSE MAX(DIARY_ID)+1 END,
        '${req.body.studentId}' ,
        '${req.body.content}' ,
        'Y',
        '${req.body.creId}' ,
        NOW()
    FROM DIARY
     `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/user/save failed sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/user/save called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    saveDiary
}