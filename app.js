const unirest = require('unirest')
const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT || 3000;
const {languages} = require('./langs.js')

// const {decode_base64} = require('./decode.js')

let inputdata, outputdata;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./views/'));

app.use('/',(req,res,next)=>{
	MongoClient.connect('mongodb://localhost:27017/testcases', async (err,client) => {
		if(err) throw err;
		var db = client.db('testcases');
		const result = await db.collection('problems').findOne({"id" : 2});
		inputdata = result.inputdata;
		outputdata = result.outputdata;
		next();
	})	
})

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
	
	postsubmission.send({
		"language_id": language,
		"source_code": req.body.code,
		"stdin" : inputdata
	}).then(function (postres) {
		
		if (postres.error) throw new Error(postres.error);
		
		var URL = `https://judge0.p.rapidapi.com/submissions/${postres.body.token}?base64_encoded=false`;

		var getsubmission = unirest("GET", URL);

		getsubmission.headers({
			"x-rapidapi-host": "judge0.p.rapidapi.com",
			"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
			"useQueryString": true,
		});

		setTimeout(() => getsubmission.end(function(getres) {
			
			if (getres.error) throw new Error(getres.error);
			
			// console.log(getres.body.stdout);

			if(getres === outputdata){
				res.send({
					stdout : outputdata,
					discription : "accepted"
				})
			}
			else{
				res.json({
					stdout : getres.body.stdout,
					discription : "wa"
				})
			}
		}),7000)
	})
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))