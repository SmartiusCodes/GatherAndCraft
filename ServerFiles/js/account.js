var JsonData;

function EnterGame(username, password, method) {
	socket.emit("EnterGame", username, password, method);
}

socket.on("EnterGameFailed", (reason) => {
	alert(reason);
});

socket.on("EnterGameCompleted", (AccountJson) => {
	JsonData = AccountJson;
	$("#content").load("game.html");
});