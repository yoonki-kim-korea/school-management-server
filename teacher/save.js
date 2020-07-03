const Log = require('../utils/debug.js');

/**
 * 학생정보 입력화면에서 사용가능한 일련번호 목록 조회
 */
const validSeqList = (req, res, connection) => { 
    
    let year = req.query.year;
    let currentTeacherNo = req.query.currentTeacherNo;

    if(!year){        
        Log.error(`/api/teacher/validseq/list failed. 파라미터 부재 year=${year}, dpt=${dpt}`);
        res.send({"seqList": [] });
        return;
    }

    let sql = `
    SELECT SEQ_STR AS "seq"
    FROM DUMMY_SEQ
    WHERE 1=1
    AND SEQ NOT IN (SELECT SEQ
                      FROM (SELECT SUBSTRING(TEACHER_NO,1,2) AS YEAR
                                 , CONVERT(SUBSTRING(TEACHER_NO,3,5), UNSIGNED) AS SEQ    
                              FROM TEACHER 
                              WHERE 1=1
    `;
    
    if(!!currentTeacherNo) {
        sql += ` AND TEACHER_NO != '${currentTeacherNo}'  `;
    }

    sql += `                          
                            ) A
                     WHERE 1=1
                       AND YEAR = '${year}'
    )   `;    

    connection.query(sql,
        (err, rows, fields) => {
            if(err) {
                Log.error(`/api/student/validseq/list failed. sql=${sql} err=${err}`);
                res.send({"seqList": []});
            }else{     
                let seqList = [];
                for(let i=0; i < rows.length; i++){
                    seqList.push(rows[i]);
                }
                Log.print(`/api/student/validseq/list called. sql=${sql}`);
                res.send({"seqList": seqList});
            }
        }
    );
}

/**
 * 교직원 기본정보
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function teacherSave(req, res, connection)  {

    //기본정보 저장    
    let sql = ` SELECT CASE WHEN TEACHER_ID IS NULL THEN 0 ELSE MAX(TEACHER_ID)+1 END AS "nextId"
                  FROM TEACHER  `;

    //교직원정보 저장
    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/api/teacher/save failed. sql=${sql} err=${err}`); 
                res.send({result:'failed', msg:err});
           }
           if(!!rows || rows.length > 0){    
                Log.print(`/api/teacher/save called. 교사정보 저장을 위해 추출한  studenId=${rows[0].nextId}`); 
                
                try {          
                    req.body.teacherId = rows[0].nextId; 
                    if(!req.body.teacherId){
                        Log.print(`/api/teacher/save failed. PK 추출 실패 sql=${sql}`); 
                        res.json({result:'failed', msg:'교사정보 저장에 실패하였습니다.' });
                    }     
                    if(saveBasicInfo(req, res, connection)){       
                        Log.print(`/api/teacher/save called. sql=${sql}`);     
                        res.json({result:'success', msg:'교사정보를 저장하였습니다.', teacherId:req.body.teacherId });
                    }
                } catch (error) {   
                    Log.error(`/api/teacher/save failed. sql=${sql} error=${error}`); 
                    res.json({result:'failed', msg:'교사정보 저장에 실패하였습니다.' });
                }
           }
        }
    );    
}//teacherSave

/**
 * pk 추출후 교사정보 저장
 * @param {*} req 
 * @param {*} res 
 * @param {*} connection 
 */
async function saveBasicInfo(req, res, connection)  {

    //기본정보 저장    
    let sql = `
    INSERT INTO TEACHER (
        TEACHER_ID,
        TEACHER_NO,
        TEACHER_NAME,
        TEACHER_ENG_NAME,
        BIRTHDAY,
        MOBILE_NO,
        EMAIL,
        GENDER,
        JOIN_DAY,
        RESIGN_DAY,
        WORK_STATUS,
        DUTY,
        PLZ,
        ADDRESS_CITY,
        ADDRESS_DTL,
        USE_YN,
        CRE_ID,
        CRE_DTM        
    ) VALUES( 
        '${req.body.teacherId}',
        '${req.body.teacherNo}' ,
        '${req.body.teacherName}' ,
        '${req.body.teacherEngName}' ,
        '${req.body.birthday}' ,
        '${req.body.mobileNo}' ,
        '${req.body.email}',
        '${req.body.gender}' ,
        '${req.body.joinDay}' ,
        '${req.body.resignDay}' ,
        '${req.body.workStatus}' ,
        '${req.body.duty}' ,
        '${req.body.plz}' ,
        '${req.body.addressCity}' ,
        '${req.body.addressDtl}',
        'Y' ,
        '${req.body.creId}' ,
        NOW()
    )
    `;
    //기본정보 저장
    let params = [];
    connection.query(sql, params, 
        (err, rows, fields) => {            
            if(err) {
                Log.error(`/api/teacher/save failed. sql=${sql} err=${err}`);
                return false
            }else{
                Log.print(`/api/teacher/save called. sql=${sql}`);   
                return true;
            }
        }
    );
}//saveBasicInfo

module.exports = {
    validSeqList,
    teacherSave
}
