const Log = require('../utils/debug.js');

//사용자 삭제
deleteUser = (req, res, connection) => {     
    
    let userId = req.body.userId;
    let udtId  = req.body.udtId;

    let sql = `
    UPDATE USER 
    SET 
        USE_YN = 'N',
        UDT_ID =  '${udtId}',
        UDT_DTM = NOW()        
    WHERE USER_ID = '${userId}'   `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/user/delete called sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/user/delete called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    deleteUser
}
