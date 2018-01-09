var socket = io(`http://${window.location.hostname}:3010`);
var joined = false;

socket.emit('register', {
  name: 'eudago'
});

socket.on('join_room', (data) => {
  joined = true;
  console.log('join to room: ' + data.room);
})

function createRoom() {
  if(!joined) {
    socket.emit('add_room', {});
  }
}
