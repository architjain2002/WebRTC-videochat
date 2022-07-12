const io = require("socket.io");

io.sockets.on("connection", (socket) => {
  // when a client creates or joins a room in client side
  socket.on("create or join", (room) => {
    // io.sockets.clients gives the number of connections in a room
    const numberOfClients = io.sockets.clients(room).length();

    if (numberOfClients === 0) {
      socket.join(room);
      socket.emit("created", room);
    }

    if (numberOfClients == 1) {
      //this will emit the message to whoever is present in the room (here we have only one client)
      io.to(room).emit("join", room);
      socket.join(room);
      socket.emit("joined", room);
    } else {
      socket.emit("full", room);
    }

    // when a client sends a message

    socket.on("message", (message) => {
      socket.broadcast.to(room).emit("message", message);
    });
  });
});

module.exports = io;
