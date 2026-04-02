const { Server } = require("socket.io");

const { handleAuth } = require("./handlers/Authhandler");
const { handleRoom } = require("./handlers/Roomhandler");
const { handleChat } = require("./handlers/Chathandler");
const { handleVideo } = require("./handlers/Videohandler");
const { handleRole } = require("./handlers/Rolehandler");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔥 Inject io + socket into all handlers
    handleAuth(io, socket);
    handleRoom(io, socket);
    handleChat(io, socket);
    handleVideo(io, socket);
    handleRole(io, socket);

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };