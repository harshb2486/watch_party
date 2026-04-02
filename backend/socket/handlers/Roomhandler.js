const { activeUsers, rooms } = require("../helpers");
const { nanoid } = require("nanoid");

function handleRoom(io, socket) {

  socket.on("create_room", (_, callback) => {
    const username = activeUsers.get(socket.id);

    if (!username) {
      return callback({ error: "Not logged in" });
    }

    const roomId = nanoid(6).toUpperCase();

    rooms[roomId] = {
      users: [
        {
          id: socket.id,
          username,
          role: "host",
        },
      ],
      videoId: "dQw4w9WgXcQ",
      isPlaying: false,
      time: 0,
    };

    socket.join(roomId);

    console.log("Room created:", roomId);
    callback({ roomId });
  });

 const rooms = {};

socket.on("join_room", ({ roomId }, cb) => {
  socket.join(roomId);

  // ✅ CREATE ROOM if not exists
  if (!rooms[roomId]) {
    rooms[roomId] = {
      videoId: "dQw4w9WgXcQ",
      host: socket.id,
    };
  }

  const room = rooms[roomId];

  console.log("ROOM:", roomId, room);

  // send video to user
  socket.emit("sync_state", {
    videoId: room.videoId,
  });

  cb({ success: true });
});
}

module.exports = { handleRoom };