const Log = require('../utils/debug.js');

/**
 * 수업료 목록 조회
 */    
legacyList = (req, res, connection) => { 
    
    let sql = `
    SELECT  sid	 AS "sid",
            snr	 AS "snr",
            koreanname	 AS "koreanname",
            vater	 AS "vater",
            geboren	 AS "geboren",
            gender	 AS "gender",
            lastname	 AS "lastname",
            vorname	 AS "vorname",
            klasse1	 AS "klasse1",
            klasse2	 AS "klasse2",
            s_zimmer1	 AS "s_zimmer1",
            s_zimmer2	 AS "s_zimmer2",
            immadat1	 AS "immadat1",
            immadat2	 AS "immadat2",
            geborenin	 AS "geborenin",
            strasse	 AS "strasse",
            plz	 AS "plz",
            ort	 AS "ort",
            telefon	 AS "telefon",
            mutter	 AS "mutter",
            ebeirat	 AS "ebeirat",
            notruf	 AS "notruf",
            firmanr	 AS "firmanr",
            hfirma	 AS "hfirma",
            dfirma	 AS "dfirma",
            kontonr	 AS "kontonr",
            blz	 AS "blz",
            bank	 AS "bank",
            bankinh	 AS "bankinh",
            monatbeitrag1	 AS "monatbeitrag1",
            monatbeitrag2	 AS "monatbeitrag2",
            beitragsfrei	 AS "beitragsfrei",
            exmadatum1	 AS "exmadatum1",
            exmadatum2	 AS "exmadatum2",
            exmart1	 AS "exmart1",
            exmart2	 AS "exmart2",
            zahlart	 AS "zahlart",
            abuchung	 AS "abuchung",
            eintrittdat1	 AS "eintrittdat1",
            eintrittdat2	 AS "eintrittdat2",
            kurzlang	 AS "kurzlang",
            eingabe	 AS "eingabe",
            email	 AS "email",
            sonder1	 AS "sonder1",
            sonder2	 AS "sonder2",
            iban	 AS "iban",
            bic	 AS "bic",
            sondimma1	 AS "sondimma1",
            sondexma1	 AS "sondexma1",
            sondimma2	 AS "sondimma2",
            sondexma2	 AS "sondexma2"
    FROM PARADOX   
    WHERE 1=1
    `;
  
    if(!!req.query.sid) {
        sql += "\n" + `AND sid = '${req.query.sid}'`; 
    } 
    if(!!req.query.snr) {
        sql += "\n" + `AND snr = '${req.query.snr}'`; 
    }
    if(!!req.query.koreanname) {
        sql += "\n" + `AND koreanname LIKE '${req.query.koreanname}%'`; 
    }
    if(!!req.query.lastname) {
        sql += "\n" + `AND  lastname LIKE '${req.query.lastname}%'`; 
    }
    if(!!req.query.vorname) {
        sql += "\n" + `AND vorname LIKE '${req.query.vorname}%'`; 
    }
    
    sql += ` 
    ORDER BY sid
    `;

    connection.query(sql,
        (err, rows, fields) => {
            if(err){
                Log.error(`/legacy/paradox/listfailed. sql=${sql}, error=${err}`);
                res.send({"results": []});
            }else{              
                let results = [];
                for(let i=0; i < rows.length; i++){
                    results.push(rows[i]);
                }
                Log.print(`/legacy/paradox/list called  sql=${sql}`);
                res.send({"results": results});
            }
        }
    );
}//legacyList

module.exports = {
    legacyList
}