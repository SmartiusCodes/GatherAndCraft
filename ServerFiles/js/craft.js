var craftingList;
var display;
var craftDisplay;
var selected = "Weapons";

var crafting;

function updateAccountInfo() {
    $.getJSON("/Data/" + AccountData.Username + "/Data.json", function (json) {
        AccountData = json;
    });
}

$.getJSON("/Backend/Crafting.json", function (json) {
    updateAccountInfo();
    craftingList = json;
    craftDisplay = document.getElementById("craftDisplay");

    for (const [key] of Object.entries(craftingList.Weapons)) {
        display = document.createElement('a');
        display.setAttribute("id", key);
        display.setAttribute("onclick", "craft(" + key + ")");
        display.textContent = key + "\r\n";
        if (AccountData.Game.Inventory.Weapons[key] == undefined) {
            display.textContent += "Amount: " + 0;
        } else {
            display.textContent += "Amount: " + AccountData.Game.Inventory.Weapons[key].Amount;
        }
        craftDisplay.appendChild(display);
    }
});

function changeCraftDisplay() {
    updateAccountInfo();
    craftDisplay = document.getElementById("craftDisplay");
    selected = document.getElementById("dropdown").value;

    while (craftDisplay.firstChild) {
        craftDisplay.removeChild(craftDisplay.firstChild);
    }

    for (const [key] of Object.entries(craftingList[selected])) {
        display = document.createElement('a');
        display.setAttribute("id", key);
        display.setAttribute("onclick", "craft(" + key + ")");
        display.textContent = key + "\r\n";
        if (AccountData.Game.Inventory[selected][key] == undefined) {
            display.textContent += "Amount: " + 0;
        } else {
            display.textContent += "Amount: " + AccountData.Game.Inventory[selected][key].Amount;
        }
        craftDisplay.appendChild(display);
    }
}

socket.on("CraftComplete", (Item, Amount) => {
    updateAccountInfo();
    craftDisplay = document.getElementById("craftDisplay");
    selected = document.getElementById("dropdown").value;

    while (craftDisplay.firstChild) {
        craftDisplay.removeChild(craftDisplay.firstChild);
    }

    for (const [key] of Object.entries(craftingList[selected])) {
        display = document.createElement('a');
        display.setAttribute("id", key);
        display.setAttribute("onclick", "craft(" + key + ")");
        display.textContent = key + "\r\n";
        if (key == Item) {
            display.textContent += "Amount: " + Amount;
        } else if (AccountData.Game.Inventory[selected][key] == undefined) {
            display.textContent += "Amount: " + 0;
        } else {
            display.textContent += "Amount: " + AccountData.Game.Inventory[selected][key].Amount;
        }
        craftDisplay.appendChild(display);
    }
});

function craft(x) {
    crafting = x.id;
    var craftInfo = [];
    getCraft(craftInfo);
    //console.log(craftInfo[0] + " - " + craftInfo[1] + " - " + craftInfo[2]);

    if (AccountData.Game.Inventory.CurrentAmount >= AccountData.Game.Inventory.MaxSpace) {
        alert("Not enough space to craft this!");
        return;
    }

    for (var i = 0; i < craftInfo[0].length; i += 2) {
        if (craftInfo[0][i] > AccountData.Game.Resources[craftInfo[0][i + 1]]) {
            alert("You do not have enough " + craftInfo[0][i + 1] + "!");
            return;
        }
    }

    //Craft Item
    socket.emit("Craft", AccountData.Username, selected, crafting, craftInfo);
}

function getCraft(craftInfo) {
    var cost = [];
    var time = 0;
    var tier = 0;
    for (const [key] of Object.entries(craftingList[selected][crafting].BaseCost)) {
        cost.push(craftingList[selected][crafting].BaseCost[key]);
        cost.push(key);
    }
    time = craftingList[selected][crafting].TimeToCraft;
    if (AccountData.Game.Inventory[selected][crafting] == undefined) {
        tier = 0;
    } else {
        tier = AccountData.Game.Inventory[selected][crafting].tier;
    }

    craftInfo.push(cost);
    craftInfo.push(time);
    craftInfo.push(tier);

    return craftInfo;
}