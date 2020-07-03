const Log = require('../utils/debug.js');

//사용자 목록 조회
userList = (req, res, connection) => {    

    let sql = `
    SELECT USER_ID AS "userId",
           USER_NAME AS "userName",
           AUTH_CD AS "authCd",
           B.CODE_NAME AS "auth"        
    FROM USER A
    LEFT JOIN COMMON_CODE B
    ON A.AUTH_CD = B.CODE
    AND B.SUPER_CODE = 'USER_AUTH_CD'
    WHERE 1=1
    AND USER_ID = '${req.query.id}'
    AND USER_PW = '${req.query.password}'

    `;
    Log.print(`/auth/login/check called. sql=${sql}`);

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/auth/login/check called. sql=${sql}, err=${err}`);
                res.send({"myuser": {}});
            }else{
                let myuser = {};

                if(rows && rows.length == 1){
                    myuser.info = rows[0];
                    myuser.isSuccess = "Y";
                    Log.print(myuser)
                }else {
                    myuser.info = {};
                    myuser.isSuccess = "N";
                }
                res.send({"myuser": myuser});
            }
        }
    );
};

module.exports = {
    userList
}