const Log = require('../utils/debug.js');

//사용자 목록 조회
userList = (req, res, connection) => {    
   
    let userId = req.query.userId;
    let userName = req.query.userName;
    let userPw = req.query.userPw;
    let sql = `
    SELECT USER_ID AS "userId",
           USER_NAME AS "userName",
           USER_PW AS "userPw",
           AUTH_CD AS "authCd",
           B.CODE_NAME AS "auth"        
    FROM USER A
    LEFT JOIN COMMON_CODE B
    ON A.AUTH_CD = B.CODE
    AND B.SUPER_CODE = 'USER_AUTH_CD'
    WHERE A.USE_YN = 'Y'
    `;
    
    if(!!userId) {
        sql += "\n" + `AND USER_ID = '${userId}'`; 
    }

    if(!!userName) {
        sql += "\n" + `AND USER_NAME LIKE '${userName}%'`; 
    }

    if(!!userPw) {
        sql += "\n" + `AND USER_PW = '${userPw}'`; 
    }

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/user/list failed. sql=${sql}, error=${err}`);
                res.send({"users": []});
            }else{
                let users = [];
                for(let i=0; i < rows.length; i++){
                    users.push(rows[i]);
                }
                Log.print(`/api/user/list called. sql=${sql}`);
                res.send({"users": users});
            }
        }
    );
};


module.exports = {
    userList
}