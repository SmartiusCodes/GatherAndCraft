const express = require('express');
const fs = require("fs");
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}})
const d = new Date();

////////WEBSITE SETUP////////
app.use(express.static(__dirname + "/Public"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/main.html');
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listen on port ${port}...`);
  console.log('Gather & Craft is running!');
});


////SENDING DATA AND RECIVING DATA FROM CLIENT AND SERVER IS HERE////
io.on('connection', (socket) => {
  ////User Login or Register////
  socket.on("EnterGame", (username, password, method) => {
    ////check user input////
    if (method == "register") {
      if (username.length < 5 || username.length > 20) {
        socket.emit('EnterGameFailed', "Username has to be between 5 and 20 characters!");
      } else if (password.length == 0) {
        socket.emit("EnterGameFailed", "Fill in all fields!");
      } else if (fs.existsSync("./Public/Data/" + username)) {
        socket.emit('EnterGameFailed', "Username Already Exists!");
      } else {
      ////Register or Login////
        fs.readFile("./Public/JSON/NewAccount.json", "utf8", (err, data) => {
          if (err) throw err;
          ////LOAD NEWACCOUNT.JSON INTO A VARIABLE FOR FURTHER USAGE////
          var NewAccount = JSON.parse(data);
          NewAccount.Username = username;
          NewAccount.Password = password;
          NewAccount.Joined = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
          fs.mkdirSync("./Public/Data/" + username, { recursive: true });
          fs.writeFile("./Public/Data/" + username + "/Data.json", JSON.stringify(NewAccount), function(err, result) {
            if (err) throw err;
          });
          ////Send user to Game with account details as JSON////
          socket.emit('EnterGameCompleted', NewAccount);
        });
      }
    } else {
      if (fs.existsSync("./Public/Data/" + username)) {
        fs.readFile("./Public/Data/" + username + "/Data.json", "utf8", (err, data) => {
          if (err) throw err;
          var Account = JSON.parse(data);
          if (Account.Password == password) {
            ////Send user to Game with account details as JSON////
            socket.emit("EnterGameCompleted", Account);
          } else {
            socket.emit("EnterGameFailed", "Incorrect password!");
          }
        });
      } else {
        socket.emit("EnterGameFailed", "Account does not exist!");
      }
    }
  });
});