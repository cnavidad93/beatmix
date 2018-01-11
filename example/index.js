const socket = io(`http://${window.location.hostname}:3010`);
let joined = false;
let totalUser = 0;

socket.emit('log_in', {
  name: 'eudago'
});

socket.on('room_joined', (room) => {
  let $urlRoom = document.getElementById('url-room');
  let $usersRoom = document.getElementById('users-room');

  joined = true;
  $urlRoom.innerHTML = `@${room.name}`;
  totalUser = room.totalUser
  $usersRoom.innerHTML = totalUser;

  changeView();
  console.log('joined to room: ', room);
});

socket.on('notification', (message) => {
  if(message === 'joined_user') {
    totalUser = totalUser + 1;
    let $usersRoom = document.getElementById('users-room');
    $usersRoom.innerHTML = totalUser;
  }
  console.log(message);
});

function createRoom() {
  if(!joined) {
    socket.emit('create_room');
  }
}
function leaveRoom() {
  if(joined) {
    joined = false;
    totalUser--;
    socket.emit('leave_room');

    changeView();
  }
}
function joinRoom() {
  let $input = document.getElementById('room-name').value;
  if(!joined) {
    joined = true;
    totalUser++;
    socket.emit('join_room', $input);
  }
}


function validateInput(elm){
  let $input = document.getElementById('room-name').value;
  if($input.length > 3){
    document.getElementById('join-button').disabled = false;
  }else{
    document.getElementById('join-button').disabled = true;
  }
}
function changeView(){
  document.getElementById('room-page').classList.toggle('fade-in');
  document.getElementById('room-page').classList.toggle('fade-out');

  document.getElementById('login-page').classList.toggle('fade-in');
  document.getElementById('login-page').classList.toggle('fade-out');
}
