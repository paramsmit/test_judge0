const unirest = require('unirest')

var getreq = unirest("GET", "https://judge0.p.rapidapi.com/submissions/c6bdedb6-83a7-418e-97fd-66a62ce95268?base64_encoded=true");

getreq.headers({
	"x-rapidapi-host": "judge0.p.rapidapi.com",
	"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
	"useQueryString": true,
});

getreq.end(function (res) {
	if (res.error) throw new Error(res.error);
	console.log(res.body);
});