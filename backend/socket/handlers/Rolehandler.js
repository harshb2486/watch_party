const { rooms } = require("../helpers");

function handleRole(io, socket) {

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

    io.to(roomId).emit("user_list", { users: room.users, host: room.host });

    callback({ success: true });
  });

}

module.exports = { handleRole };