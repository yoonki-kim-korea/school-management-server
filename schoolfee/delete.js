const Log = require('../utils/debug.js');

async function schoolfeeDelete(req, res, connection)  {
    
    let sql = `
    DELETE FROM SCHOOL_FEE 
    WHERE APPLY_YEAR = '${req.body.applyYear}'
      AND APPLY_MONTH = '${req.body.applyMonth}'
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/schoolfee/deletefailed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/schoolfee/delete called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}

module.exports = {
    schoolfeeDelete
}
