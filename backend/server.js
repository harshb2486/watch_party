const express = require("express");
const http = require("http");
const cors = require("cors");
const { initSocket } = require("./socket/index");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const server = http.createServer(app);

// initialize socket
initSocket(server);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});