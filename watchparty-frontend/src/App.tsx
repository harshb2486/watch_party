import { useState } from "react";
import { socket } from "./socket";
import Room from "./components/Room";
import type { ApiResponse } from "./types";

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // LOGIN
  const login = () => {
    if (!username) return alert("Enter username");

    socket.emit("login", { username }, (res: ApiResponse) => {
      if (res.error) {
        alert(res.error);
      } else {
        setIsLoggedIn(true);
      }
    });
  };

  // CREATE ROOM
  const createRoom = () => {
    socket.emit("create_room", {}, (res: ApiResponse) => {
      if (res.error) return alert(res.error);

      setRoomId(res.roomId);
      setJoined(true);
    });
  };

  // JOIN ROOM
  const joinRoom = () => {
    if (!roomId) return alert("Enter room ID");

    socket.emit("join_room", { roomId }, (res: ApiResponse) => {
      if (res.error) {
        alert(res.error);
      } else {
        setJoined(true);
      }
    });
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      
      {/* 🔐 LOGIN SCREEN */}
      {!isLoggedIn && (
        <>
          <h2>Login</h2>
          <input
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br /><br />
          <button onClick={login}>Login</button>
        </>
      )}

      {/* 🏠 DASHBOARD */}
      {isLoggedIn && !joined && (
        <>
          <h2>Welcome {username}</h2>

          <button onClick={createRoom}>Create Room</button>

          <br /><br />

          <input
            placeholder="Enter Room ID"
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      )}

      {/* 🎬 ROOM */}
      {joined && <Room roomId={roomId} />}
    </div>
  );
}

export default App;