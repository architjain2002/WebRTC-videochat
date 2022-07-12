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
