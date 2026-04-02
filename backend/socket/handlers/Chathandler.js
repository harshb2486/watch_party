const { activeUsers, rooms } = require("../helpers");

function handleChat(io, socket) {

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 👥 JOIN ROOM
  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);

    socket.user = { username }; // 🔥 important

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

    // 🔥 THIS LINE FIXES REAL-TIME
    io.to(roomId).emit("receive_message", msgData);
  });
});
}

module.exports = { handleChat };