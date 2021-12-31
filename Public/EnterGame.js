var socket = io();

function EnterGame(username, password, method) {
	socket.emit("EnterGame", username, password, method);
}