const { rooms, canControl } = require("../helpers");

function handleVideo(io, socket) {
socket.on("play", ({ roomId, time }) => {
    const room = rooms[roomId];
    if (!room) return;
    if (!canControl(roomId, socket.id)) return;

    room.isPlaying = true;
    room.time = time;

  socket.to(roomId).emit("play", { time });
});

socket.on("pause", ({ roomId, time }) => {
    const room = rooms[roomId];
    if (!room) return;
    if (!canControl(roomId, socket.id)) return;

    room.isPlaying = false;
    room.time = time;

  socket.to(roomId).emit("pause", { time });
});

socket.on("change_video", ({ roomId, videoId }) => {
  const room = rooms[roomId];
  if (!room) return;

  if (!canControl(roomId, socket.id)) return;

  // 🔄 update room video
  room.videoId = videoId;

  // 📡 send to ALL users in room with full state
  io.to(roomId).emit("sync_state", {
    videoId: room.videoId,
    isPlaying: room.isPlaying || false,
    time: room.time || 0,
  });
});

}

module.exports = { handleVideo };