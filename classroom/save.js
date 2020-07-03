const Log = require('../utils/debug.js');

/**
 * 교실 정보 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveClassroom(req, res, connection)  {
 
    if(!req.body.classroomName){
        res.send({"result":"failed","error":"교실명 누락"});
    }

    let sql = `
    INSERT INTO CLASSROOM (
        CLASSROOM_NAME,
        POSITION_DESC,
        CAPACITY,
        USE_YN,        
        CRE_ID,
        CRE_DTM
    ) VALUES (
        '${req.body.classroomName}' ,
        '${req.body.positionDesc}' ,
        ${req.body.capacity} ,
        'Y' ,
        '${req.body.creId}' ,
        NOW()
    )`;

    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => { 
            if(err) {
                Log.error(`/api/classroom/save failed. sql=${sql}, error=${err}`);
                res.send({"result":"failed","error":err});
            }else{
                Log.print(`/api/classroom/save called. sql=${sql}, error=${err}`);
                res.send({"result":"success"});
            }
        }
    );
}//saveClassroom

module.exports = {
    saveClassroom
}
