const Log = require('../utils/debug.js');

//학생정보 저장전 학번 유효여부 검사
checkValidUserId = (req, res, connection) => { 
       
    let userId = req.query.userId;

    let sql = `
    SELECT CASE WHEN COUNT(*) = 0 THEN 'Y' ELSE 'N' END AS RESULT 
    FROM USER
    WHERE 1=1
    AND USER_ID = '${userId}'   `;

    Log.print(`/api/user/valid result. called sql=${sql}`);

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/user/valid failed. sql=${sql}, error=${err}`);
                res.send({"duplCheck": [{"RESULT":"N"}]});
            }else{          
                let duplCheck = [];
                for(let i=0; i < rows.length; i++){
                    duplCheck.push(rows[i]);
                }                
                Log.print(`/api/user/valid result. duplCheck=${duplCheck[0].RESULT}`);
                res.send({"duplCheck": duplCheck});
            }
        }
    );
}

//사용자정보 저장
saveUser = (req, res, connection) => { 
    
    let userId = req.body.userId;
    let userName = req.body.userName;
    let userPw = req.body.userPw;
    let authCd = req.body.authCd;
    let creId  = req.body.creId;

    let sql = `
    INSERT INTO USER (
        USER_ID,
        USER_NAME,
        USER_PW,
        AUTH_CD,
        CRE_ID,
        CRE_DTM
    ) VALUES (
        '${userId}' ,
        '${userName}' ,
        '${userPw}' ,
        '${authCd}' ,
        '${creId}' ,
        NOW()
    )
     `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/user/save called sql=${sql}, err=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/user/save called sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    checkValidUserId,
    saveUser
}