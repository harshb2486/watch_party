const { activeUsers, isUsernameTaken, rooms } = require("./helpers");
const { nanoid } = require("nanoid");

function handleRoomEvents(io, socket) {

  // LOGIN
  socket.on("login", ({ username }, callback) => {
      if (activeUsers.has(socket.id)) {
    return callback({ error: "Already logged in" });
  }

    if (!username) {
      return callback({ error: "Username required" });
    }

    if (isUsernameTaken(username)) {
      return callback({ error: "Username already taken" });
    }

    activeUsers.set(socket.id, username);

    console.log("User logged in:", username);

    callback({ success: true });
  });

  // CREATE ROOM
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

socket.on("join_room", ({ roomId }, callback) => {
  const username = activeUsers.get(socket.id);

  if (!username) return callback({ error: "Not logged in" });
  if (!rooms[roomId]) return callback({ error: "Room not found" });

  socket.join(roomId);

  const exists = rooms[roomId].users.find(u => u.id === socket.id);

  if (!exists) {
    rooms[roomId].users.push({
      id: socket.id,
      username,
      role: "viewer",
    });
  }

  // 🔥 SEND AFTER JOIN
  setTimeout(() => {
    socket.emit("current_user", { id: socket.id });
  }, 100);

  io.to(roomId).emit("user_list", rooms[roomId].users);

  callback({ success: true });
});

  // DISCONNECT
  socket.on("disconnect", () => {
    const username = activeUsers.get(socket.id);

    console.log("User disconnected:", username);

    activeUsers.delete(socket.id);

    for (let roomId in rooms) {
      const room = rooms[roomId];

      const leavingUser = room.users.find(u => u.id === socket.id);

      room.users = room.users.filter(u => u.id !== socket.id);

      if (leavingUser?.role === "host" && room.users.length > 0) {
        room.users[0].role = "host";
        console.log("New host assigned:", room.users[0].username);
      }

      if (room.users.length === 0) {
        delete rooms[roomId];
        console.log("Room deleted:", roomId);
      } else {
        io.to(roomId).emit("user_list", room.users);
      }
    }
  });

  socket.on("logout", (callback) => {
  const username = activeUsers.get(socket.id);

  if (!username) {
    return callback({ error: "User not logged in" });
  }

  console.log("User logging out:", username);

  // remove from active users
  activeUsers.delete(socket.id);

  // remove from all rooms
  for (let roomId in rooms) {
    const room = rooms[roomId];

    const leavingUser = room.users.find(u => u.id === socket.id);

    room.users = room.users.filter(u => u.id !== socket.id);

    // if host leaves → assign new host
    if (leavingUser?.role === "host" && room.users.length > 0) {
      room.users[0].role = "host";
    }

    if (room.users.length === 0) {
      delete rooms[roomId];
    } else {
      io.to(roomId).emit("user_list", room.users);
    }
  }

  callback({ success: true });

});

socket.on("play", ({ roomId }) => {
  console.log("PLAY RECEIVED BACKEND");

  socket.to(roomId).emit("play");
});

socket.on("pause", ({ roomId }) => {
  console.log("PAUSE RECEIVED BACKEND");

  socket.to(roomId).emit("pause");
});

socket.on("seek", ({ roomId, time }) => {
  if (!canControl(roomId, socket.id)) return;

  rooms[roomId].time = time;
  socket.to(roomId).emit("seek", { time });
});

socket.on("assign_role", ({ roomId, userId, role }, callback) => {
  const room = rooms[roomId];

  if (!room) return callback({ error: "Room not found" });

  const currentUser = room.users.find(u => u.id === socket.id);

  console.log("CURRENT USER:", currentUser);

  if (!currentUser || currentUser.role !== "host") {
    return callback({ error: "Only host can assign roles" });
  }

  const allowedRoles = ["moderator", "participant", "viewer"];

  if (!allowedRoles.includes(role)) {
    return callback({ error: "Invalid role" });
  }

  const user = room.users.find(u => u.id === userId);

  if (!user) return callback({ error: "User not found" });

  if (user.role === "host") {
    return callback({ error: "Cannot change host role" });
  }

  user.role = role;

  io.to(roomId).emit("user_list", room.users);

  callback({ success: true });
});

socket.on("send_message", ({ roomId, message }) => {
  const username = activeUsers.get(socket.id);

  if (!username || !rooms[roomId]) return;

  const msgData = {
    username,
    message,
    time: new Date().toLocaleTimeString(),
  };

  io.to(roomId).emit("receive_message", msgData);
});

}

module.exports = { handleRoomEvents };