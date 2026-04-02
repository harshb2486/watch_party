const express = require("express");
const http = require("http");
const cors = require("cors");
const { initSocket } = require("./socket/index");
const db = require("./config/db");
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);
const app = express();

app.use(cors());
app.use(express.json()); // 🔥 IMPORTANT

// routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const server = http.createServer(app);

// socket init
initSocket(server);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});