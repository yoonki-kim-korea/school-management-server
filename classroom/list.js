const Log = require('../utils/debug.js');

/**
 * 교실 목록 조회
 */    
classroomList = (req, res, connection) => { 
    
    let sql = `
    SELECT CLASSROOM_ID AS "classroomId",
           CLASSROOM_NAME AS "classroomName",
           POSITION_DESC AS "positionDesc",
           CAPACITY AS "capacity"
    FROM CLASSROOM 
    WHERE USE_YN = 'Y'
    `;
    if(!!req.query.classroomName) {
        sql += "\n" + `AND CLASSROOM_NAME LIKE '${req.query.classroomName}%'`; 
    }
    sql += `
    ORDER BY CLASSROOM_NAME `; 

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/classroom/list failed. sql=${sql}, error=${err}`);
                res.send({"classrooms": []});
            }else{              
                let classrooms = [];
                for(let i=0; i < rows.length; i++){
                    classrooms.push(rows[i]);
                }
                Log.print(`/api/classroom/list called  sql=${sql}`);
                res.send({"classrooms": classrooms});
            }
        }
    );
}//classroomList

module.exports = {
    classroomList
}