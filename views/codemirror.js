const map = new Map();
map.set("C++ (GCC 8.3.0)", "text/x-c++src")
.set("C (GCC 8.3.0)","text/x-csrc")
.set("JavaScript (Node.js 12.14.0)","text/javascript")
.set("Java (OpenJDK 13.0.1)", "text/x-java")
.set("Python(3.8.1)","text/x-python");

var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,  
    tabSize: 4,
    mode: 'text/x-c++src',  
    matchBrackets: true,
});
editor.save()

function changemode(){
    var mode = document.getElementById("lan").value;
    editor.setOption("mode", map.get(mode));
    editor.save()
}

module.exports.editor = editor;