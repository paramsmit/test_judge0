const unirest = require('unirest')

var req = unirest("POST", "https://judge0.p.rapidapi.com/submissions");

req.headers({
	"x-rapidapi-host": "judge0.p.rapidapi.com",
	"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
	"content-type": "application/json",
	"accept": "application/json",
	"useQueryString": true,
	"base64_encoded" : true
});

req.type("json");
req.send({
	"language_id": 53,
	"source_code": `
		#include <iostream>
		using namespace std;
		int main(void) {
			while(1){}
		}
`,
	// "stdin": "world"
});

req.end(function (res) {
	// if (res.error) throw new Error(res.error);
	console.log(res.body);
});

