const { Server } = require("socket.io");
const { handleRoomEvents } = require("./roomHandler");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    handleRoomEvents(io, socket);
  });
}

module.exports = { initSocket };