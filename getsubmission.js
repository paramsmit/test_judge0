const unirest = require('unirest')

var getreq = unirest("GET", "https://judge0.p.rapidapi.com/submissions/53707546-e65d-447f-8cb4-cf49f982a515?base64_encoded=true");

getreq.headers({
	"x-rapidapi-host": "judge0.p.rapidapi.com",
	"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
	"useQueryString": true,
});

getreq.end(function (res) {
	if (res.error) throw new Error(res.error);
	console.log(res.body);
});