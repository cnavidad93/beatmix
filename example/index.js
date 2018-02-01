const socket = io(`http://${window.location.hostname}:3010`);
const configuration = {
 iceServers: [{
   urls: 'stun:stun.l.google.com:19302' // Google's public STUN server
 }]
};
let joined = false;
let totalUser = 0;
let pc;

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
  if(room.totalUser > 1) connectWebRTC(room.webrtc);
});

socket.on('notification', (message) => {
  if(message === 'joined_user') {
    totalUser = totalUser + 1;
    let $usersRoom = document.getElementById('users-room');
    $usersRoom.innerHTML = totalUser;
  }
  console.log(message);
});

socket.on('webrtc_message_client', (message) => {
  if (message.sdp) {
    pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
    }, (err) => {
      console.log(err)
    });
  }
  else if (message.candidate) {
    pc.addIceCandidate(
      new RTCIceCandidate(message.candidate), (r) => {
        console.log(r)
      }, (err) => {
        console.log(err)
      }
    );
  }
});

function createRoom() {
  if(!joined) {
    startWebRTC();
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

function sendWebRtcDescription(debug) {
  socket.emit('webrtc_description', d);
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

function startWebRTC() {
 pc = new RTCPeerConnection(configuration);
 pc.onicecandidate = event => {
   if (event.candidate) {
     //console.log({'candidate': event.candidate});
   }
 };
 pc.onnegotiationneeded = () => {
   pc.createOffer()
     .then(localDescCreated)
     .catch((err) => {
       console.log(err)
     });
 }
 navigator.mediaDevices.getUserMedia({
   audio: true,
   video: true,
 }).then(stream => {
   localVideo.srcObject = stream;
   pc.addStream(stream);
 }, (err) => {
   console.log(err);
 });
}

function connectWebRTC(message) {
  pc = new RTCPeerConnection(configuration);
  pc.onaddstream = event => {
    remoteVideo.srcObject = event.stream;
  };
  pc.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('webrtc_message', {'candidate': event.candidate});
    }
  };

  pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
    if (pc.remoteDescription.type === 'offer') {
      pc.createAnswer()
      .then(localDescCreatedSend)
      .catch((err) => {
        console.log(err);
      });
    }
  }, (err) => {
    console.log(err);
  });
}

function localDescCreatedSend(desc) {
  pc.setLocalDescription(
    desc,
    () => {
      socket.emit('webrtc_message', {'sdp': pc.localDescription});
    },
    (err) => {console.log(err)}
  );
}

function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => {
      socket.emit('create_room', {'sdp': pc.localDescription});
    },
    (err) => {console.log(err)}
  );
}
