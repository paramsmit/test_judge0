const unirest = require('unirest')
const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient
const PORT = 3000;
const {languages} = require('./langs.js')
// const {decode_base64} = require('./decode.js')

var inputdata, outputdata;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./views/'));

app.use('/',(req,res,next) => {
	
		MongoClient.connect('mongodb://localhost:27017/testcases', (err,client) => {
			try{
				if(err) throw err;
				var db = client.db('testcases');
				var promise = new Promise((resolve,reject) => {
					// if id does not match then also returns error as null
					db.collection('problems').findOne({"id" : 2}, (err,result)=>{
						err ? reject("Internal Server Error") : resolve(result)
					})
				})
				promise.then(result => {
					inputdata = result.inputdata
					outputdata = result.outputdata
					client.close()
					next();
				})
				.catch(
					err => {
						res.send({
							"discription" : err
						})
						client.close()			
				})	
		
		}catch(err){
			res.send({
				"discription" : "Internal Server Error"
			})
		}
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

	postsubmission.type("json"); // use of this line

	var language = languages.get(req.body.lan);
	
	postsubmission.send({
		"language_id": language,
		"source_code": req.body.code,
		"stdin" : inputdata
	}).then(function (postres) {
		
		if (postres.error) throw new Error(postres.error);
		// error comes when compilation failed in c++ and c ... base64 encoding

		var URL = `https://judge0.p.rapidapi.com/submissions/${postres.body.token}?base64_encoded=false`;

		var getsubmission = unirest("GET", URL);

		getsubmission.headers({
			"x-rapidapi-host": "judge0.p.rapidapi.com",
			"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
			"useQueryString": true,
		});

		setTimeout(() => getsubmission.end(function(getres) {
			try{
				if (getres.error){ 
					// for c++ 400 error is coming
					console.log(getres)
					throw "runtime or compilation error"
				}

				var stdout = getres.body.stdout
				var discription = getres.body.status.description

				if(stdout === outputdata){
					res.send({
						"discription" : "Accepted",
					})
				}	
				else if(discription === "Accepted" && stdout !== outputdata){
					res.send({
						"discription" : "wrong answer",
					})	
				}
				else{
					res.send({
						"discription" : discription,
					})
				}

			}catch(err) {res.send({
				"discription" : err
			})}
		}),7000)
	})
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))