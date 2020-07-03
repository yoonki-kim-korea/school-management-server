const Log = require('../utils/debug.js');

/**
 * 학급 정보 삭제
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function deleteClassinfo(req, res, connection)  {

    let sql = `
    UPDATE CLASS_INFO 
      SET  USE_YN = 'N',
           UDT_DTM = NOW(),
            UDT_ID = '${req.body.udtId}'
     WHERE CLASS_ID = '${req.body.classId}'
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classroom/update called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                res.send({"result":"success"});
            }
        }
    );
}//deleteClassinfo

module.exports = {
    deleteClassinfo
}
