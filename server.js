const conf = require('./conf')
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')({ transports: ['websocket'] })

io.attach(conf.socket_port)

app.use(express.static('test'))

http.listen(conf.http_port, function(){
  console.log(`listening on *:${conf.http_port}`);
});

io.on('connection', function(socket){

});
