room = prompt("Enter your room name:");

const socket = io("http://localhost:80"); // this will connect to backend which is currently being server on port 80
socket.on("connect", () => {
  console.log(socket.id);
});
