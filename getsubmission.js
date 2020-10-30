const unirest = require('unirest')

var getreq = unirest("GET", "https://judge0.p.rapidapi.com/submissions/b60c250f-45d3-47eb-8ec4-c31bc0cc1e04?base64_encoded=true");

getreq.headers({
	"x-rapidapi-host": "judge0.p.rapidapi.com",
	"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
	"useQueryString": true,
});

getreq.end(function (res) {
	if (res.error) throw new Error(res.error);
	console.log(res.body);
});