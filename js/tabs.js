function enableButtons() {
    var buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        button.disabled = false;
    }
}


document.getElementById("craftBtn").onclick = function () {
    enableButtons();
    document.getElementById("craftBtn").disabled = true;
    $("#content").load("craft.html");
}

document.getElementById("customersBtn").onclick = function () {
    enableButtons();
    document.getElementById("customersBtn").disabled = true;
    $("#content").load("customers.html");
}
document.getElementById("workersBtn").onclick = function () {
    enableButtons();
    document.getElementById("workersBtn").disabled = true;
    $("#content").load("workers.html");
}