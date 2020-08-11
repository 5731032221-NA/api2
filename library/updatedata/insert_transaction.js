const config = require('../config');
const pool = require('node-jt400').pool(config);
const datetimetxn = require('../datetimetxn');

module.exports.insert = (async function (res, req, dtf, TOPIC, CHANNEL) {

    var dttxn = await datetimetxn.getdatetimetxn(req.body.TXN_DTE);
    var insert = "insert into MBRFLIB/MTRN1P";
    insert += " (MBCODE,PNID,PNNUM,MTXNTYP,MBAMT,MBCURC,MBAMT1,MBCURS,MBDATCHK,MBREFT,MBACQB,CNTRYCD3,MTXNPOS,MTXNVID,MTXNCARD,MERID,MCHNAME,TERMINAL3,MERCATG,MERCITY,MERCNTY,DATETIME)";
    insert += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    var insert_params = [
        req.body.MBCODE,
        req.body.PARTNER_ID,
        req.body.CARD_REF,
        req.body.TXN_TYPE,
        req.body.TXN_ORI_AMT,
        //'50.00',
	req.body.TXN_ORI_CCY,
        req.body.TXN_BILL_AMT,
        //'50.00',
	req.body.TXN_BILL_CCY,
        dttxn,
        //'2020-01-06',
	req.body.TXN_REFNBR,
        req.body.ACQUIRER_BANK,
        req.body.ACQUIRER_CNTY,
        req.body.TXN_POS_INFO,
        req.body.TXN_VALID_ID,
        req.body.TXN_CARDPRESENT,
        req.body.MERCH_ID,
        req.body.MERCH_NAME,
        req.body.MERCH_TID,
        req.body.MCC_CATG,
        req.body.MERCH_CITY,
        req.body.MERCH_CNTY,
	dtf
    ];


    console.log('insert');
    console.log(insert);


    try {
        var result = await pool.insertAndGetId(insert, insert_params);
        console.log(result);

        if (result >= 0) {
            return true;
        } else {
            res.status(200).json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 304,
                "RESP_MSG": "Not success, Insert Transaction fail",
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
        }
    }
    catch (error) {
        console.log("503 error message: " + error.stack);
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



