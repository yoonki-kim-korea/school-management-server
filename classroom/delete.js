const Log = require('../utils/debug.js');

/**
 * 교실 정보 삭제
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function deleteClassroom(req, res, connection)  {

    let sql = `
    UPDATE CLASSROOM 
      SET  USE_YN = 'N',
           UDT_DTM = NOW(),
           UDT_ID = '${req.body.udtId}'
     WHERE CLASSROOM_ID = '${req.body.classroomId}'
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classroom/delete failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classroom/delete called. sql=${sql}`);
                res.send({"result":"success"});
            }
        }
    );
}//deleteClassroom

module.exports = {
    deleteClassroom
}
