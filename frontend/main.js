let localStream;
let remoteStream;

// ice servers for candidates here i have considered all the stun servers
const servers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
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

  createOffer(); // to create the offer
};

init(); //invoke

let createOffer = async () => {
  peerConnection = new RTCPeerConnection(servers); // we create connection by passing all the ice candidates

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

  // onicecandidates is event is called then we just check
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(event.candidate);
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log(offer);
};
