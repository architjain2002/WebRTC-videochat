const static = require("node-static");
const http = require("http");
const express = require("express");
const app = express();
const file = new static.Server();
require("dotenv").config();

const server = http.createServer(app);
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
