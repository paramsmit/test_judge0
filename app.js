const unirest = require('unirest')
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./views/'));

app.post('/', (req, res) => {

	var postreq = unirest("POST", "https://judge0.p.rapidapi.com/submissions");

	postreq.headers({
		"x-rapidapi-host": "judge0.p.rapidapi.com",
		"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
		"content-type": "application/json",
		"accept": "application/json",
		"useQueryString": true,
		"base64_encoded" : true
	});

	postreq.type("json");

	console.log(req.body);

	postreq.send({
		"language_id": 53,
		"source_code": req.body.code

	// "stdin": "world"	
	});

	postreq.end(function (postres) {
		if (res.error) throw new Error(res.error);
		// console.log(res.body);
		console.log(postres.body);
		res.send(postres.body);
	});
})


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// 