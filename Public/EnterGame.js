var socket = io();
var IGN;

function EnterGame(username, password, method) {
	socket.emit("EnterGame", username, password, method);
}

socket.on("EnterGameFailed", (reason) => {
	alert(reason);
});

socket.on("EnterGameCompleted", (username) => {
	IGN = username;
	$("#content").load("Game.html");
});