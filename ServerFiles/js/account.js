var AccountData;

function EnterGame(username, password, method) {
	socket.emit("EnterGame", username, password, method);
}

socket.on("EnterGameFailed", (reason) => {
	alert(reason);
});

socket.on("EnterGameCompleted", (AccountJson) => {
	AccountData = AccountJson;
	$("#tabs").load("tabs.html");
	$("#playerInfo").load("playerInfo.html");
	$("#content").load("customers.html");
});