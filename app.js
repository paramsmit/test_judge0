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

app.use('/',(req,res,next) => {
	
		MongoClient.connect('mongodb://localhost:27017/testcases', (err,client) => {
			try{
				if(err) throw err;
				var db = client.db('testcases');
				var promise = new Promise((resolve,reject)=>{
					// if id does not match then also returns error as null
					db.collection('problems').findOne({"id" : 2}, (err,result)=>{
						err ? reject(err) : resolve(result)
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
						res.send(err)
						client.close()			
				})
			
			// const result = await db.collection('problems').findOne({"id" : 2});
			// inputdata = result.inputdata;
			// outputdata = result.outputdata;		
		}catch(e){
			res.send(e)
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
		// error comes when compilation failed in c++ and c

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
					throw "error is catched"
				}

				var stdout = getres.body.stdout
				var discription = getres.body.status.description
				var message = getres.body.message
				var stderr = getres.body.stderr
				var compile_output = getres.body.compile_output

				if(getres.body.stdout === outputdata){
					res.send({
						"stdout" : stdout,
						"discription" : "Accepted",
						"message" : message,
						"stderr" : stderr,
						"compile_output" : compile_output
					})
				}	
				else if(discription === "Accepted" && stdout !== outputdata){
					res.send({
						"stdout" : stdout,
						"discription" : "wrong answer",
						"message" : message,
						"stderr" : stderr,
						"compile_output" : compile_output
					})
				}
			
				else{
					res.send({
						"stdout" : stdout,
						"discription" : discription,
						"message" : message,
						"stderr" : stderr,
						"compile_output" : compile_output
					})
				}

			// all the possiblities of the answer mle tle wa accepted runtime error etc
			// verdict
			}catch(e) {res.send(e)}
		}),7000)
	})
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))