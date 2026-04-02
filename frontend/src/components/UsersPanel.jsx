import { useEffect, useState } from "react";
import socket from "../socket";

function UsersPanel({ roomId }) {
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState(null);

  useEffect(() => {
    const handleUsers = ({ users, host }) => {
      console.log("👥 USERS:", users);
      setUsers(users);
      setHost(host);
    };

    socket.off("user_list"); // prevent duplicate
    socket.on("user_list", handleUsers);

    return () => socket.off("user_list", handleUsers);
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>👥 Users</h3>

      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          maxWidth: "200px",
        }}
      >
        {users.map((u) => (
          <div key={u.id} style={{ marginBottom: "5px" }}>
            {u.username} {u.id === host && "👑"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPanel;