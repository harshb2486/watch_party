let rooms = {};
let activeUsers = new Map(); 
// socketId → username

function isUsernameTaken(username) {
  return [...activeUsers.values()].includes(username);
}

function getUsername(socketId) {
  return activeUsers.get(socketId);
}

function getUser(roomId, socketId) {
  return rooms[roomId]?.users.find(u => u.id === socketId);
}

function isHost(roomId, socketId) {
  const user = getUser(roomId, socketId);
  return user && user.role === "host";
}

function canControl(roomId, socketId) {
  const user = getUser(roomId, socketId);

  return user && (
    user.role === "host" ||
    user.role === "moderator"
  );
}

module.exports = {
  rooms,
  activeUsers,
  isUsernameTaken,
  getUsername,
};