const conf    = require('./conf');
const express = require('express');
const app     = express();
const http    = require('http').Server(app);
const io      = require('socket.io')({ transports: ['websocket'] });
const rooms   = require('./actions/rooms');
const users   = require('./actions/users');
const router    = require('./api/index');

io.attach(conf.socket_port);

app.use(express.static('example'));
app.use('/api', router);

http.listen(conf.http_port, () => {
  console.log(`listening on *:${conf.http_port}`);
});

io.on('connection', (socket) => {
  rooms.run(socket, io);
  users.run(socket, io);
});
