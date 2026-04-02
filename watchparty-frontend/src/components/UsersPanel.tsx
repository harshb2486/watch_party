import { useEffect, useState } from "react";
import { socket } from "../socket";

type User = {
  id: string;
  username: string;
  role: string;
};

type Props = {
  roomId: string;
};

const UsersPanel = ({ roomId }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  // 👤 current user
   useEffect(() => {
  socket.on("current_user", (data) => {
    console.log("RECEIVED CURRENT USER:", data);
    setCurrentUserId(data.id);
  });

  return () => socket.off("current_user");
}, []);

  // 👥 user list
  useEffect(() => {
    const handleUsers = (data: User[]) => {
      console.log("USERS RECEIVED:", data);
      setUsers(data);
    };

    socket.on("user_list", handleUsers);

    return () => {
      socket.off("user_list", handleUsers);
    };
  }, []);

  // 🎯 check if host
 function isHost(roomId, socketId) {
  const user = rooms[roomId]?.users.find(u => u.id === socketId);
  return user && user.role === "host";
}
  // 🎯 change role
const changeRole = (userId: string, role: string) => {
  console.log("TRY CHANGE:", userId, role);

  socket.emit("assign_role", { roomId, userId, role }, (res: any) => {
    console.log("RESPONSE:", res);

    if (res.error) {
      alert(res.error);
    }
  });
};

  // 🎯 role icons
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "host":
        return "👑";
      case "moderator":
        return "🔵";
      case "participant":
        return "🟢";
      case "viewer":
        return "⚪";
      default:
        return "";
    }
  };

  console.log("USERS STATE:", users);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>👥 Users in Room</h3>

      {users.map((u) => (
        <div key={u.id} style={{ marginBottom: 8 }}>
          {u.username} {getRoleIcon(u.role)} ({u.role})

          {/* ✅ Only host can change roles */}
          {u.id !== currentUserId && (
            <select
              value={u.role}
              onChange={(e) => changeRole(u.id, e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="viewer">Viewer</option>
              <option value="participant">Participant</option>
              <option value="moderator">Moderator</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
};

export default UsersPanel;