const { activeUsers, rooms } = require("../helpers");

function handleChat(io, socket) {
  // Attach handlers to the already-connected socket instance

  // 👥 JOIN ROOM
  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);

    socket.user = { username };

    console.log(username, "joined", roomId);
  });

  // 💬 SEND MESSAGE
  socket.on("send_message", ({ roomId, message }) => {
    const msgData = {
      username: socket.user?.username || "Guest",
      message,
      time: new Date().toLocaleTimeString(),
    };

    console.log("MESSAGE:", msgData);

    io.to(roomId).emit("receive_message", msgData);
  });
}

module.exports = { handleChat };