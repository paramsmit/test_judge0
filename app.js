const unirest = require('unirest')
const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient
const PORT = 3000;
const {languages} = require('./langs.js')
const {decode_base64} = require('./decode.js')

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./views/'));

var inputdata, outputdata;

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
		"base64_encoded" : true
	});

	postsubmission.type("json"); // use of this line

	var language = languages.get(req.body.lan);
	// if(req.body.code === "") {
	// 	res.send({
	// 		"discription" : "source code can't be blank"
	// 	})
	// }
	
	postsubmission.send({
		"language_id": language,
		"source_code": req.body.code,
		"stdin" : inputdata
	}).then(function (postres){

		if (postres.status === 422){
			throw "source code can't be blank";
		} 
		
		var URL = `https://judge0.p.rapidapi.com/submissions/${postres.body.token}?base64_encoded=true`;

		var getsubmission = unirest("GET", URL);

		getsubmission.headers({	
			"x-rapidapi-host": "judge0.p.rapidapi.com",
			"x-rapidapi-key": "168bcf348emsh412770aea95bbcdp1cff1djsn3ff583f3e2d2",
			"useQueryString": true,
		});


		setTimeout(() => getsubmission.end(function(getres) {
			
				var stdout = getres.body.stdout
				stdout = decode_base64(stdout)
				// decode output from base64 to ascii

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
			
		}),7000)
	}).catch(err => {
		res.send({"discription" : err})
	})
})
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))