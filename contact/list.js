const Log = require('../utils/debug.js');

//교사별 계약 목록 조회
contactList = (req, res, connection) => {    
   
    let sql = `
    SELECT CONTACT_ID AS "contactId",
	       CONTACT_START_DATE AS "contactStartDate",
	       CONTACT_END_DATE AS "contactEndDate",
	       REAL_END_DATE AS "realEndDate"
    FROM CONTACT
    WHERE USE_YN = 'Y'
    AND TEACHER_ID = ${req.query.teacherId}
    ORDER BY CONTACT_ID
    `;

    connection.query(sql,
        (err, rows, fields) => {
            let results = [];
            if(err) {
                Log.error(`/api/teacher/contact/list failed. sql=${sql}, err=${err}`);
                res.send({"results": results});
            }else{
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/api/teacher/contact/list called. sql=${sql}`);
                res.send({"results": results});
            }
        }
    );
};

module.exports = {
    contactList
}