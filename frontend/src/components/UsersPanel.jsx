import { useEffect, useState } from "react";
import socket from "../socket";

function UsersPanel({ roomId }) {
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState(null);

  useEffect(() => {
    const handleUsers = (payload) => {
      // backend sends { users, host }
      const data = Array.isArray(payload) ? { users: payload, host: null } : payload;
      console.log("👥 USERS:", data.users, "host:", data.host);
      setUsers(data.users || []);
      setHost(data.host || null);
    };

    socket.off("user_list"); // prevent duplicate
    socket.on("user_list", handleUsers);

    return () => socket.off("user_list", handleUsers);
  }, []);

  const changeRole = (userId, role) => {
    console.log("emit assign_role ->", { roomId, userId, role });
    socket.emit("assign_role", { roomId, userId, role }, (res) => {
      console.log("assign_role response:", res);
      if (res?.error) return alert(res.error);
      // optimistic update: reflect role change locally until server emits user_list
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, role } : u));
    });
  };

  const myId = socket.id;
  const myRole = users.find(u => u.id === myId)?.role || null;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>👥 Users</h3>

      <div style={{ fontSize: 12, color: 'gray' }}>socket id: {myId} — my role: {myRole || 'unknown'}</div>

      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          maxWidth: "300px",
        }}
      >
        {users.length === 0 && <div>No users in room</div>}
        {users.map((u) => (
          <div key={u.id} style={{ marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <strong>{u.username}</strong>
              <span style={{ marginLeft: 8, fontSize: 12, color: 'gray' }}>{u.role ? `(${u.role})` : '(participant)'} {u.id === host && " 👑"}</span>
            </div>

            {/* only host (socket id === host) can change roles for others; can't change host's role */}
            {myId === host && u.id !== host ? (
              <select value={u.role || 'participant'} onChange={(e) => changeRole(u.id, e.target.value)}>
                <option value="participant">participant</option>
                <option value="moderator">moderator</option>
                <option value="viewer">viewer</option>
              </select>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPanel;