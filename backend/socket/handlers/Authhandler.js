const { activeUsers, isUsernameTaken, rooms } = require("../helpers");

function handleAuth(io, socket) {

  socket.on("login", ({ username }, callback) => {

    if (!username) {
      return callback({ error: "Username required" });
    }

    if (isUsernameTaken(username)) {
      return callback({ error: "Username already taken" });
    }

    activeUsers.set(socket.id, username);
    // attach to socket so other handlers can read it immediately
    socket.user = { username };

    console.log("User logged in:", username, "(id:", socket.id, ")");

    callback({ success: true });
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
      io.to(roomId).emit("user_list", { users: room.users, host: room.host });
    }
  }

  callback({ success: true });

});
}

module.exports = { handleAuth };