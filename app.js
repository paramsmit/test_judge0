const unirest = require('unirest')
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const {languages} = require('./langs.js')
const {decode_base64} = require('./decode.js')

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./views/'));

app.post('/', (req, res) => {

	var postsubmission = unirest("POST", "https://judge0.p.rapidapi.com/submissions");
	postsubmission.headers({
		"x-rapidapi-host": "judge0.p.rapidapi.com",
		"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
		"content-type": "application/json",
		"accept": "application/json",
		"useQueryString": true,
	});

	postsubmission.type("json");

	var language = languages.get(req.body.lan);
	console.log(req.body.code);

	postsubmission.send({
		"language_id": language,
		"source_code": req.body.code,
		// "stdin" : `
		// 	1
		// 	2
		// 	3
		// `
	}).then(function (postres) {
	
		if (postres.error) throw new Error(postres.error);
		var URL = `https://judge0.p.rapidapi.com/submissions/${postres.body.token}?base64_encoded=true`;

		var getsubmission = unirest("GET", URL);

		getsubmission.headers({
			"x-rapidapi-host": "judge0.p.rapidapi.com",
			"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
			"useQueryString": true,
		});

		setTimeout(() => getsubmission.end(function(getres) {
			if (getres.error) throw new Error(getres.error);
			// console.log(getres.body);
			res.send(getres.body);
		}),7000)
	})
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))