const express = require('express');
const fs = require("fs");
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } })
const d = new Date();

////////WEBSITE SETUP////////
app.use(express.static(__dirname + '/ServerFiles'))

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Listen on port ${port}...`);
    console.log('Gather & Craft is running!');
});


////SENDING DATA AND RECIVING DATA FROM CLIENT AND SERVER IS HERE////
io.on('connection', (socket) => {

    ////User Login or Register////
    socket.on("EnterGame", (username, password, method) => {

        if (username.length < 4 || username.length > 20) {
            socket.emit('EnterGameFailed', "Username has to be between 4 and 20 characters!");
            return;
        }

        if (password.length < 1) {
            socket.emit("EnterGameFailed", "Fill in all fields!");
            return;
        }

        if (method == "register") {
            Register(socket, username, password);
        } else {
            Login(socket, username, password);
        }

    });

    //Crafting
    socket.on("Craft", (Account, Catagory, Item, Info) => {
        var Amount;
        //ReadToFile
        fs.readFile("./ServerFiles/Data/" + Account + "/Data.json", (err, data) => {
            if (err) throw err;
            var Data = JSON.parse(data);
            //Modify Resources
            for (var i = 0; i < Info[0].length; i += 2) {
                Data.Game.Resources[Info[0][i + 1]] -= Info[0][i];
            }
            Data.Game.Inventory.CurrentAmount++;

            if (Data.Game.Inventory[Catagory][Item] == undefined) {
                var obj = {
                    "Amount":1
                }
                Data.Game.Inventory[Catagory][Item] = obj;
            } else {
                Data.Game.Inventory[Catagory][Item].Amount++;
            }

            Amount = Data.Game.Inventory[Catagory][Item].Amount;
            
            //WriteToFile
            var data = JSON.stringify(Data);
            fs.writeFile("./ServerFiles/Data/" + Account + "/Data.json", data, (err) => {
                if (err) throw err;
                socket.emit("CraftComplete", Item, Amount);
            });
        });
    });

});

function Register(socket, username, password) {
    if (fs.existsSync("./ServerFiles/Data/" + username)) {
        socket.emit('EnterGameFailed', "Username Already Exists!");
        return;
    }
    fs.readFile("./ServerFiles/Backend/NewAccount.json", "utf8", (err, data) => {
        if (err) throw err;

        ////LOAD NEWACCOUNT.JSON INTO A VARIABLE FOR FURTHER USAGE////
        var NewAccount = JSON.parse(data);
        NewAccount.Username = username;
        NewAccount.Password = password;
        NewAccount.Joined = d.toLocaleDateString("fr-FR");

        fs.mkdirSync("./ServerFiles/Data/" + username, { recursive: true });
        fs.writeFile("./ServerFiles/Data/" + username + "/Data.json", JSON.stringify(NewAccount), function (err, result) {
            if (err) throw err;
        });

        ////Send user to Game with account details as JSON////
        socket.emit('EnterGameCompleted', NewAccount);
    });
}

function Login(socket, username, password) {
    if (!(fs.existsSync("./ServerFiles/Data/" + username))) {
        socket.emit("EnterGameFailed", "Account does not exist!");
        return;
    }
    fs.readFile("./ServerFiles/Data/" + username + "/Data.json", "utf8", (err, data) => {
        if (err) throw err;

        var Account = JSON.parse(data);

        if (Account.Password == password) {
            ////Send user to Game with account details as JSON////
            socket.emit("EnterGameCompleted", Account);
        } else {
            socket.emit("EnterGameFailed", "Incorrect password!");
        }

    });
}