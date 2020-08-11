
module.exports.getdatetimetxn = (function (date) {


	var dt = new Date(date);
        //dt.setHours(dt.getHours());
	dt = dt.toISOString();


	var dv = dt.substring(0, 10);

	var date_v = dv.substring(0, 4) + dv.substring(5, 7) + dv.substring(8, 10);

	var tv = dt.substring(11, 19);
	var hp = tv.substring(0, 2);
	var mp = tv.substring(3, 5);
	var sp = tv.substring(6, 8);

	var time_v = hp + mp + sp;

	var dtf = date_v + time_v;
	return dtf;
})
