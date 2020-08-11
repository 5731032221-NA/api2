const lookup_mvm01p = require('./library/lookup/lookup_mvm01p');
const lookup_subscribe = require('./library/lookup/lookup_subscribe');
const insert_transaction = require('./library/updatedata/insert_transaction');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const datetime = require('./library/datetime');
const schema = require('./library/checkSchema');

const request = require('request');

app.listen(8204, function () {
    console.log('app listening on port 8204!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));





app.post('/checksubscribe', async function (req, res) {

    var dtf = await datetime.getdatetime();
    var today = new Date();
    datenow = await (today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString());


    // check schema
    if (await schema.checkSchema(req, res, dtf, "checksubscribe")) {
        ;

        var TOPIC = 'VISAGAME001';
        var CHANNEL = 'Mobile';

        // insert transaction to as400
        let transaction = await insert_transaction.insert(res, req, dtf, TOPIC, CHANNEL);
        console.log("insert transaction to as400")
        //var insert_transaction = true;
	    if (transaction) {
            console.log("Today : "+today)
            console.log("Datenow : "+datenow)
            // lookup MVM01P and check connection
            let lookupmember_mvm01p = await lookup_mvm01p.lookup(res, req, dtf, req.body.MBCODE,datenow);

            ////////////// exist card //////////////////
            if (lookupmember_mvm01p) {
                ////////////// exist card //////////////////
                let lookupsubscribe = await lookup_subscribe.lookup(res, req, dtf, req.body.MBCODE, TOPIC, CHANNEL);
                if (lookupsubscribe.length > 0) {

                    if (lookupsubscribe[0].MSCRFG == 'U') {
                        //res.status(200).json({
			  let reqapi3 = {
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 201,
                            "RESP_MSG": "Success,  This MCARD " + req.body.MBCODE + " is not properly subscribed",
                            "MBCODE": req.body.MBCODE,
                            "CARD_REF": req.body.CARD_REF,
                            "TXN_TYPE": req.body.TXN_TYPE,
                            "TXN_ORI_AMT": req.body.TXN_ORI_AMT,
                            "TXN_ORI_CCY": req.body.TXN_ORI_CCY,
                            "TXN_BILL_AMT": req.body.TXN_BILL_AMT,
                            "TXN_BILL_CCY": req.body.TXN_BILL_CCY,
                            "TXN_DTE": req.body.TXN_DTE,
                            "TXN_REFNBR": req.body.TXN_REFNBR,
                            "ACQUIRER_BANK": req.body.ACQUIRER_BANK,
                            "ACQUIRER_CNTY": req.body.ACQUIRER_CNTY,
                            "TXN_POS_INFO": req.body.TXN_POS_INFO,
                            "TXN_VALID_ID": req.body.TXN_VALID_ID,
                            "TXN_CARDPRESENT": req.body.TXN_CARDPRESENT,
                            "MERCH_ID": req.body.MERCH_ID,
			    "MERCH_NAME": req.body.MERCH_NAME,
                            "MERCH_TID": req.body.MERCH_TID,
                            "MCC_CATG": req.body.MCC_CATG,
                            "MERCH_CITY": req.body.MERCH_CITY,
                            "MERCH_CNTY": req.body.MERCH_CNTY
                        }
                              	res.status(200).json(reqapi3)
				   	res.end();
			   
 
                        
			
                    } else if (lookupsubscribe[0].MSCRFG == 'S') {
                        //res.json({
			   let reqapi3 = {
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 200,
                            "RESP_MSG": "Success,  This MCARD " + req.body.MBCODE + " has already subscribed",
                            "MBCODE": req.body.MBCODE,
                            "CARD_REF": req.body.CARD_REF,
                            "TXN_TYPE": req.body.TXN_TYPE,
                            "TXN_ORI_AMT": req.body.TXN_ORI_AMT,
                            "TXN_ORI_CCY": req.body.TXN_ORI_CCY,
                            "TXN_BILL_AMT": req.body.TXN_BILL_AMT,
                            "TXN_BILL_CCY": req.body.TXN_BILL_CCY,
                            "TXN_DTE": req.body.TXN_DTE,
                            "TXN_REFNBR": req.body.TXN_REFNBR,
                            "ACQUIRER_BANK": req.body.ACQUIRER_BANK,
                            "ACQUIRER_CNTY": req.body.ACQUIRER_CNTY,
                            "TXN_POS_INFO": req.body.TXN_POS_INFO,
                            "TXN_VALID_ID": req.body.TXN_VALID_ID,
                            "TXN_CARDPRESENT": req.body.TXN_CARDPRESENT,
                            "MERCH_ID": req.body.MERCH_ID,
			    "MERCH_NAME": req.body.MERCH_NAME,
                            "MERCH_TID": req.body.MERCH_TID,
                            "MCC_CATG": req.body.MCC_CATG,
                            "MERCH_CITY": req.body.MERCH_CITY,
                            "MERCH_CNTY": req.body.MERCH_CNTY,
			    "x-global-transaction-id": req.body['x-global-transaction-id']
                        }
			request({
				url: 'http://192.168.0.9:8209/callevs',
					method: "POST",
					json: true,
					body: reqapi3
			}, async function (error, response, body) {
				if(error){console.log(error)}
					if(response.statusCode == 200){
					res.status(200).json(reqapi3)
					res.end();
					}
			});
                        //res.end();
                    }
                }

            }


        }
    }

})
