const db = require('../db/db');
const rooms = {
  run: run
};
let count_rooms = 0;

function run(socket, io){

  socket.on('create_room', sdp => {
    let _room = {};
    db.getUser(socket.id).then((user) => {
      let _admin = user;
      if(_admin !== undefined && _admin.room === undefined) {
        count_rooms++;
        _admin.room = `beatsroom_${count_rooms}`;
        _room.id = `beatsroom_${count_rooms}`;
        _room.webrtc = sdp;
        _room.name = `beatsroom_${count_rooms}`;
        _room.totalUser = 1;
        _room.admin = socket.id;
        db.saveRoom(`beatsroom_${count_rooms}`, _room).then(() => {
          socket.join(`beatsroom_${count_rooms}`);
          socket.emit('room_joined', _room);

          db.getRoom(`beatsroom_${count_rooms}`).then((_room) => {
            console.log('room: ' + JSON.stringify(_room))
          });
        });
      }
    });
  });

  socket.on('join_room', (room) => {
    db.getRoom(room).then((_room) => {
      _room.totalUser = _room.totalUser + 1;
      db.saveRoom(`beatsroom_${count_rooms}`, _room);
      db.getUser(socket.id).then((user) => {
        if(user !== undefined && user.room === undefined) {
          socket.join(_room);
          socket.emit('room_joined', _room);

          user.roomId = _room.id;
          return db.saveUser(socket.id, user)
        }
      })
      .then(() => {
        io.in(room).emit('notification', 'joined_user');
      });
    })
    .catch((error) => {
      console.log(error);
    });
  });

  socket.on('leave_room', () => {
    //socket.in(_room.id).emit('notification', 'adeu');
    //socket.leave(_room.id);
  });

  socket.on('webrtc_message', (candidate) => {
    db.getUserRoom(socket.id).then((room) => {
      console.log('admin:' + room.admin);
      io.to(room.admin).emit('webrtc_message_client', candidate);
    });
  });
}

module.exports = rooms;
