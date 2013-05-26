"use strict";
var chatters = []
  , chatters_socket = {}
  , express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , app_port = 8080;

server.listen(app_port);

//parse request bodies
app.use(express.bodyParser());
app.use(express.methodOverride());
//get routers
app.use(app.router);
//serve asset files
app.use('/assets', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/home.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('msg', { nickname: "2linko", msg: "Welcome to 2linko" });
  socket.on('set nickname', function (data) {
    if(data.nickname){
      //check if nickname is not already taken
      if(chatters.indexOf(data.nickname) === -1){
        socket.set('nickname', data.nickname, function () {
          chatters.push(data.nickname);
          chatters_socket[socket.id] = data.nickname;
          console.log(chatters);
          socket.get('nickname', function(err, nickname) {
            socket.emit('nickname set', {status: "success", nickname: nickname});
          });
        });
      }
      else{
        socket.emit('nickname set', {status: "failed"});
      }
    }
    else{
      socket.emit('nickname set', {status: "failed"});
    }
  });

  socket.on('send', function (data) {
    io.sockets.emit('msg', data);
  });

  socket.on('disconnect', function () {
    socket.get('nickname', function(err, nickname) {
      delete chatters_socket[socket.id];
      delete chatters[chatters.indexOf(nickname)];
    });
    io.sockets.emit('user disconnected');
  });
});

