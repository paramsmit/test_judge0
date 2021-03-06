import {editor} from './codemirror.js'
const lan = document.getElementById('lan')
const submitbtn = document.getElementById('submitbtn')

submitbtn.addEventListener("click",() => {
	const code = editor.getValue();
	var request = new XMLHttpRequest();
	var URL = 'http://localhost:3000/';
	const body = {
		"lan" : lan.value,
		"code" : code,	
	}	
	request.open('POST',URL);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify(body));
	request.onload = () => {
		var data = JSON.parse(request.responseText);
		document.getElementById('discription').innerHTML = data.discription;
	}
})
