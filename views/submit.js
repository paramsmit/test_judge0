// const lan = document.getElementById('lan')
const code = document.getElementById('code')


function submit(){
	
	var request = new XMLHttpRequest();
	var URL = 'http://localhost:3000/';

	const body = {
		"code" : code.value
	}
	
	request.responseType = 'json';	

	console.log(body);

	request.open('POST',URL);
	request.setRequestHeader('Content-Type', 'application/json');

	request.send(JSON.stringify(body));

	// request.onreadystatechange = ()=>{
	// 	var data = JSON.parse(request.responseText);
	// 	console.log(data);
	// }
}