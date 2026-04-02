const { rooms, canControl } = require("../helpers");

function handleVideo(io, socket) {
socket.on("change_video", ({ roomId, videoId }) => {
  rooms[roomId].videoId = videoId;
  io.to(roomId).emit("sync_state", rooms[roomId]);
});

socket.on("play", ({ roomId, time }) => {
  rooms[roomId].isPlaying = true;
  rooms[roomId].time = time;

  socket.to(roomId).emit("play", { time });
});

socket.on("pause", ({ roomId, time }) => {
  rooms[roomId].isPlaying = false;
  rooms[roomId].time = time;

  socket.to(roomId).emit("pause", { time });
});

socket.on("change_video", ({ roomId, videoId }) => {
  const room = rooms[roomId];

  if (!room) return;

  // 👑 only host allowed
  if (socket.id !== room.host) return;

  // 🔄 update room video
  room.videoId = videoId;

  // 📡 send to ALL users in room
  io.to(roomId).emit("sync_state", {
    videoId,
  });
});

}

module.exports = { handleVideo };