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
      host: socket.id,
      videoId: "dQw4w9WgXcQ",
      isPlaying: false,
      time: 0,
    };

    socket.join(roomId);

    // inform room (send users + host)
    io.to(roomId).emit("user_list", { users: rooms[roomId].users, host: rooms[roomId].host });

    console.log("Room created:", roomId);
    callback({ roomId });
  });
socket.on("join_room", ({ roomId }, cb) => {
  // prefer socket.user (set at login), fallback to activeUsers map
  const username = socket.user?.username || activeUsers.get(socket.id) || "Guest";

  console.log("join_room: socket.id=", socket.id, "socket.user=", socket.user, "activeUsers.get=", activeUsers.get(socket.id));

  // create room if missing
  if (!rooms[roomId]) {
    rooms[roomId] = {
      users: [],
      host: null,
      videoId: "dQw4w9WgXcQ",
      isPlaying: false,
      time: 0,
    };
  }

  const room = rooms[roomId];

  // add user if not present
  if (!room.users.find(u => u.id === socket.id)) {
    const role = room.users.length === 0 ? "host" : "participant";
    room.users.push({ id: socket.id, username, role });
  }

  // ensure host is set
  if (!room.host && room.users.length > 0) {
    room.host = room.users[0].id;
    room.users[0].role = "host";
  }

  socket.join(roomId);

  console.log("ROOM JOIN:", roomId, room);

  // send full sync (video + playback state)
  socket.emit("sync_state", {
    videoId: room.videoId,
    isPlaying: room.isPlaying || false,
    time: room.time || 0,
  });

  // notify everyone of updated user list
  io.to(roomId).emit("user_list", { users: room.users, host: room.host });

  cb({ success: true });
});
}

module.exports = { handleRoom };