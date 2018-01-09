const db = require('../db/db');
const rooms = {
  run: run
};
let _room = {};
let count_rooms = 0;

function run(socket){

  socket.on('create_room', data => {
    db.get(socket.id).then((user) => {
      let _admin = user;
      if(_admin !== undefined && _admin.room === undefined) {
        count_rooms++;
        _admin.room = `beatsroom_${count_rooms}`;
        _room.id = `beatsroom_${count_rooms}`;

        db.put(`beatsroom_${count_rooms}`, _room).then(() => {
          socket.join(`beatsroom_${count_rooms}`);
          socket.emit('room_joined', {
            name: `beatsrooms_${count_rooms}`
          });
        });
      }
    });
  });

  socket.on('join_room', (room) => {
    _room.id = room;
    socket.join(room);
    socket.emit('room_joined', {
      name: `beatsrooms_${count_rooms}`
    });

    db.get(socket.id).then((user) => {
      if(user !== undefined && user.room === undefined) {
        user.room = room;
        console.log(user);
        socket.in(room).emit('notification', 'hola');
      }
    });
  });

  socket.on('leave_room', () => {
    socket.in(_room.id).emit('notification', 'adeu');
    socket.leave(_room.id);
  });

}

module.exports = rooms;
