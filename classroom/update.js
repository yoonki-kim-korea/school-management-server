const Log = require('../utils/debug.js');

/**
 * 교실 정보 수정
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function updateClassroom(req, res, connection)  {

    let sql = `
    UPDATE CLASSROOM 
      SET  CLASSROOM_NAME = '${req.body.classroomName}',
           POSITION_DESC = '${req.body.positionDesc}',
           CAPACITY = ${req.body.capacity},
           UDT_DTM = NOW(),
           UDT_ID = '${req.body.udtId}'
     WHERE CLASSROOM_ID = '${req.body.classroomId}'
    `;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classroom/update called. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classroom/update called. sql=${sql} `);
                res.send({"result":"success"});
            }
        }
    );
}//updateClassroom

module.exports = {
    updateClassroom
}
