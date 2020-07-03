const Log = require('../utils/debug.js');

/**
 * 학기 정보 삭제
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function deleteSemester(req, res, connection)  {

    let sql = `
    DELETE FROM  SEMESTER 
    WHERE SEMESTER_ID = '${req.body.semesterId}'
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/semester/update called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                res.send({"result":"success"});
            }
        }
    );
}//deleteSemester

module.exports = {
    deleteSemester
}
