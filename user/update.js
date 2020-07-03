const Log = require('../utils/debug.js');

//사용자 수정
updateUser = (req, res, connection) => {     
    
    let userId = req.body.userId;
    let userName = req.body.userName;
    let userPw = req.body.userPw;
    let authCd = req.body.authCd;
    let udtId  = req.body.udtId;

    let sql = `
    UPDATE USER 
    SET 
    `;

    if(!!authCd){
        sql += `
        AUTH_CD = '${authCd}',
        `;
    }

    if(!!userName){
        sql += `
        USER_NAME = '${userName}',
        `;
    }

    if(!!userPw){
        sql += `
            USER_PW = '${userPw}',
        `;
    }

    sql += `
        UDT_ID =  '${udtId}',
        UDT_DTM = NOW()        
    WHERE USER_ID = '${userId}'   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/user/update called sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/user/update called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    updateUser
}
