const conf = require('./conf');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')({ transports: ['websocket'] });
var users = []; //TODO: tranform to Object
var rooms = [];
var count_rooms = 0;

io.attach(conf.socket_port);

app.use(express.static('test'));

http.listen(conf.http_port, () => {
  console.log(`listening on *:${conf.http_port}`);
});

io.on('connection', (socket) => {

  socket.on('register', data => {
    console.log(`register ${socket.id}`);
    users.push({
      name: data.name,
      id: socket.id
    });
  })

  socket.on('add_room', data => {
    _users = users.filter(usr => usr.id === socket.id);
    if(_users[0] !== undefined && _users[0].room === undefined) {
      count_rooms++;
      _users[0].room = `beatsrooms_${count_rooms}`;
      socket.join(`beatsrooms_${count_rooms}`);
      socket.emit('join_room', {
        room: `beatsrooms_${count_rooms}`
      });
    }
  })

  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`)
    let _users = users.filter(usr => usr.id === socket.id)
    if(_users[0] !== undefined) {
      users = users.filter(usr => usr.id !== socket.id); //;) perfomance
    }
  })
});
