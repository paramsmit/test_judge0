const {editor} = require('./codemirror.js')

const lan = document.getElementById('lan')

console.log(editor.getOption("value"));

var code = editor.getOption("value");

function submit(){
	var request = new XMLHttpRequest();
	var URL = 'http://localhost:3000/';
	const body = {
		"lan" : lan.value,
		"code" : code
	}	
	request.open('POST',URL);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify(body));
	request.onload = () => {
		var data = JSON.parse(request.responseText);
		document.getElementById('stdout').innerHTML = data.stdout;
		document.getElementById('discription').innerHTML = data.status.description;
	}
}		