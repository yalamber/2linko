"use strict";
var express = require('express')
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
  socket.emit('msg', { msg: "Welcome to 2linko" });
  socket.on('send', function (data) {
    io.sockets.emit('msg', data);
  });
});