const static = require("node-static");
const http = require("http");
const express = require("express");
const app = express();
const file = new static.Server();
require("dotenv").config();
const server = http.createServer(app);

var corsOptions = { cors: { origin: "http://127.0.0.1:5500" } };
const io = require("socket.io")(server, corsOptions); // cors: { origin: "*" } is used to allow request from other localhost in this case // testing
const port = process.env.PORT || 8000;

const singallingServer = require("./server/signalling_server.js")(io);
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
