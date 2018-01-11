const db = require('../db/db');
const users = {
  run: run
};

function run(socket, io){

  socket.on('log_in', data => {
    console.log(`Logged as ${socket.id}`);
    let _user = {
      name: data.name,
      id: socket.id
    };

    db.saveUser(socket.id, _user, function (err) {
      if (err) return console.log('Ooops!', err);
    });
  });

  socket.on('log_out', () => {
    console.log(`${socket.id} disconnected`);
    let user = _users.filter(usr => usr.id === socket.id)[0];
    if(user !== undefined) {
      _users = _users.filter(usr => usr.id !== socket.id); //;) perfomance
    }
  });
}

module.exports = users;
