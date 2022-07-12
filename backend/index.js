const static = require("node-static");
const http = require("http");
const express = require("express");
const cors = require("cors"); // used to allow request from other localhost in this case // testing
const app = express();
const file = new static.Server();
require("dotenv").config();
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8000;

const singallingServer = require("./server/signalling_server.js")(io);
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
