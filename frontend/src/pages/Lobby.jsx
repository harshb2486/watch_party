import { useState } from "react";

function Lobby({ setRoomId }) {
  const [roomInput, setRoomInput] = useState("");

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomInput) return alert("Enter room ID");
    setRoomId(roomInput.toUpperCase());
  };

  return (
    <div>
      <h2>🏠 Lobby</h2>

      <button onClick={createRoom}>Create Room</button>

      <div>
        <input
          placeholder="Enter Room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default Lobby;