const Log = require('../utils/debug.js');

//학생일지 목록 조회
diaryList = (req, res, connection) => {    
   
    let sql = `
    SELECT A.DIARY_ID AS "diaryId",
           A.STUDENT_ID AS "studentId",
           A.CONTENT AS "content",
           CASE WHEN LENGTH(A.CONTENT) > 10 THEN CONCAT(LEFT(A.CONTENT, 10), '...') ELSE A.CONTENT END AS "title", 
           A.CRE_ID AS "creId",
           DATE_FORMAT(A.CRE_DTM, '%Y-%m-%d %H:%i:%s') AS "creDtm",
           B.USER_NAME AS "creName"
    FROM DIARY A
    LEFT OUTER JOIN USER B
    ON A.CRE_ID = B.USER_ID
    WHERE A.USE_YN = 'Y'
    AND A.STUDENT_ID = ${req.query.studentId}
    `;
    
    if(!!req.query.diaryId) {
        sql += "\n" + `AND A.DIARY_ID = '${req.query.diaryId}'`; 
    }

    if(!!req.query.content) {
        sql += "\n" + `AND CONTENT LIKE '${req.query.content}%'`; 
    }

    sql += `
    ORDER BY A.STUDENT_ID, A.DIARY_ID `

    connection.query(sql,
        (err, rows, fields) => {
            let diarys = [];
            if(err) {
                Log.error(`/api/diary/list failed. sql=${sql}, err=${err}`);
                res.send({"diarys": diarys});
            }else{
                for(let i=0; i < rows.length; i++){
                    diarys.push(rows[i]);
                }
                Log.print(`/api/diary/list called. sql=${sql}`);
                res.send({"diarys": diarys});
            }
        }
    );
};

module.exports = {
    diaryList
}