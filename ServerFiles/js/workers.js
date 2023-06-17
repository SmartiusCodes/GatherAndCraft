$.getJSON("/Data/" + AccountData.Username + "/Data.json", function (json) {
    AccountData = json;
});

document.getElementById("Wood").innerHTML = "Wood: " + AccountData.Game.Workers.AssignedTo.Wood;
document.getElementById("Stone").innerHTML = "Stone: " + AccountData.Game.Workers.AssignedTo.Stone;
document.getElementById("Leather").innerHTML = "Leather: " + AccountData.Game.Workers.AssignedTo.Leather;
document.getElementById("Herbs").innerHTML = "Herbs: " + AccountData.Game.Workers.AssignedTo.Herbs;

document.getElementById("removeWood").onclick = function () {
    
}

document.getElementById("addWood").onclick = function () {

}

document.getElementById("removeStone").onclick = function () {

}

document.getElementById("addStone").onclick = function () {

}

document.getElementById("removeLeather").onclick = function () {

}

document.getElementById("addLeather").onclick = function () {

}

document.getElementById("removeHerbs").onclick = function () {

}

document.getElementById("addHerbs").onclick = function () {

}