module.exports = (io) => {
  io.sockets.on("connection", (socket) => {
    // when a client creates or joins a room in client side
    //console.log(socket.id);
    socket.on("create or join", async (room) => {
      // io.sockets.clients gives the number of connections in a room
      const numberOfClients = await io.to(room).fetchSockets();
      if (numberOfClients.length === 0) {
        socket.join(room);
        socket.emit("created", room);
      } else if (numberOfClients.length == 1) {
        //this will emit the message to whoever is present in the room (here we have only one client)
        socket.join(room);
        io.to(room).emit("join", room, socket.id);
        socket.emit("joined", room);
      } else {
        socket.emit("full", room);
      }
    });
    // when a client sends a message
    socket.on("message", (message) => {
      socket.broadcast.to(room).emit("message", message);
    });
  });
};
