room = prompt("Enter your room name:");

const socket = io("http://127.0.0.1:80"); // this will connect to backend which is currently being server on port 80
socket.on("connect", () => {
  console.log(socket.id);
});

if (room !== "") {
  console.log("Room name: " + room);
  socket.emit("create or join", room);
}

socket.on("full", (room) => {
  console.log("This room is full: " + room);
});

socket.on("created", (room) => {
  console.log("Room created: " + room);
});

socket.on("joined", (room) => {
  console.log("you joined room: " + room);
});

socket.on("join", (room, id) => {
  console.log("socket id: " + id + " joined room: " + room);
});

let localStream;
let remoteStream;

// ice servers for candidates here i have considered all the stun servers
const servers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

// to access the video and the audio streams into localstream
let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  document.getElementById("user-1").srcObject = localStream;

  offerCreation(); // to create the offer
};

init(); //invoke

let offerCreation = async () => {
  peerConnection = new RTCPeerConnection(servers); // we create connection by passing all the ice candidates
  console.log(peerConnection);

  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  }); //  to add the tracks to the peer connection

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    }); // to add the tracks to the remote stream on when tracks area added to the peer connection
  };

  // onicecandidates is event is called
  peerConnection.onicecandidate = async (event) => {
    console.log(event.candidate);
    if (event.candidate) {
      var message = { candidate: event.candidate };
      socket.emit("message", room, message);
    }
  };

  // to create and send the offer
  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  var message = { offer: offer };
  socket.emit("message", room, message);
  console.log(offer);
};

socket.on("message", async (room, message) => {
  console.log(message);
  if (message.answer !== undefined) {
    const remoDesc = new RTCSessionDescription(message.answer);
    await peerConnection.setRemoteDescription(remoDesc);
  }

  // when a client recieves an offer we first set the remote as offer and send the answer and set local as answer
  else if (message.offer !== undefined) {
    const remoteDesc = new RTCSessionDescription(message.offer);
    await peerConnection.setRemoteDescription(remoteDesc);

    //to create an answer and send it.
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    var message = { answer: answer };
    socket.emit("message", room, message);
  }
  // handling ice candidates passed
  else if (message.candidate !== undefined) {
    await peerConnection.addIceCandidate(
      new RTCIceCandidate(message.candidate)
    );
    console.log(message.candidate);
  }
});

// // handling ice candidates passed
// socket.on("candidate", async (room, candidate) => {
//   await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//   console.log(candidate);
// });
