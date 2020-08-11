const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.lookup = (async function (res, req, dtf, MBCODE,date_str) {


    var stmt = "select * from (select ROW_NUMBER() OVER (ORDER BY  MVM01P.MBCODE) AS ROWNUM,MVM01P.* from MBRFLIB/MVM01P MVM01P where (MVM01P.MBCODE = '" + MBCODE + "') and MVM01P.MBMEMC != 'AT' and MVM01P.MBEXP > " + date_str + " and MVM01P.MBCODE not in (select MBCODE from MBRFLIB/MCRTA28P) and MVM01P.MBDAT = (SELECT MAX(MBDAT) FROM MBRFLIB/MVM01P P2 WHERE MVM01P.MBID = P2.MBID AND P2.MBMEMC != 'AT' )) as tbl WHERE tbl.ROWNUM BETWEEN 1 AND 1";
    try {
        result = await pool.query(stmt)

        if (result.length == 1) {
            return true;
        } else {
            console.log("302 error MBCODE: " + MBCODE);
            console.log("datetime: " + dtf);
            res.status(200).json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 302,
                "RESP_MSG": "Not success, No record in Mcard",
                "MBCODE": req.body.MBCODE,
                "CARD_REF": req.body.CARD_REF,
                "TXN_TYPE": req.body.TXN_TYPE,
                "TXN_ORI_AMT": req.body.TXN_ORI_AMT,
                "TXN_ORI_CCY": req.body.TXN_ORI_CCY,
                "TXN_BILL_AMT": req.body.TXN_BILL_AMT,
                "TXN_BILL_CCY": req.body.TXN_BILL_CCY,
                "TXN_DTE": req.body.TXN_DTE,
                "TXN_REFNBR": req.body.TXN_REFNBR,
                "ACQUIRER_BANK": req.body.ACQUIER_BANK,
                "ACQUIRER_CNTY": req.body.ACQUIER_CNTY,
                "TXN_POS_INFO": req.body.TXN_POS_INFO,
                "TXN_VALID_ID": req.body.TXN_VALID_ID,
                "TXN_CARDPRESENT": req.body.TXN_CARDPRESENT,
                "MERCH_ID": req.body.MERCH_ID,
                "MERCH_TID": req.body.MERCH_TID,
                "MCC_CATG": req.body.MCC_CATG,
                "MERCH_CITY": req.body.MERCH_CITY,
                "MERCH_CNTY": req.body.MERCH_CNTY

            });
            res.end();
            return false;
        }
    } catch (err) {
        console.log("503 error message: " + err.stack);
        console.log("datetime: " + dtf);
        res.status(200).json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 503,
            "RESP_MSG": "Not success, Connect Database Error",
            "MBCODE": req.body.MBCODE,
            "CARD_REF": req.body.CARD_REF,
            "TXN_TYPE": req.body.TXN_TYPE,
            "TXN_ORI_AMT": req.body.TXN_ORI_AMT,
            "TXN_ORI_CCY": req.body.TXN_ORI_CCY,
            "TXN_BILL_AMT": req.body.TXN_BILL_AMT,
            "TXN_BILL_CCY": req.body.TXN_BILL_CCY,
            "TXN_DTE": req.body.TXN_DTE,
            "TXN_REFNBR": req.body.TXN_REFNBR,
            "ACQUIRER_BANK": req.body.ACQUIER_BANK,
            "ACQUIRER_CNTY": req.body.ACQUIER_CNTY,
            "TXN_POS_INFO": req.body.TXN_POS_INFO,
            "TXN_VALID_ID": req.body.TXN_VALID_ID,
            "TXN_CARDPRESENT": req.body.TXN_CARDPRESENT,
            "MERCH_ID": req.body.MERCH_ID,
            "MERCH_TID": req.body.MERCH_TID,
            "MCC_CATG": req.body.MCC_CATG,
            "MERCH_CITY": req.body.MERCH_CITY,
            "MERCH_CNTY": req.body.MERCH_CNTY
        });
        res.end();
        return false;
    }
});


