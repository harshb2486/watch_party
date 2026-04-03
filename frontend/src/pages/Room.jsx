import { useEffect, useState } from "react";
import socket from "../socket";
import Player from "../components/Player";
import Chat from "../components/Chat";
import UsersPanel from "../components/UsersPanel";

function Room({ roomId, user }) {
  const [connected, setConnected] = useState(false);
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ");

  // 🔌 CONNECT + JOIN (ONLY ONCE)
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("✅ socket connected");
    }

    // 🔐 login
    socket.emit("login", { username: user }, () => {
      // 👥 join room after login
      socket.emit("join_room", { roomId, username: user }, () => {
        setConnected(true); // ✅ now UI shows
      });
    });

  }, []); // 🔥 ONLY ONCE

  // 🎬 VIDEO SYNC
  useEffect(() => {
    const handleSync = ({ videoId }) => {
      console.log("SYNC RECEIVED:", videoId);
      setVideoId(videoId);
    };

    socket.on("sync_state", handleSync);

    return () => {
      socket.off("sync_state", handleSync);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🎬 Room: {roomId}</h2>
      <h3>👤 User: {user}</h3>

      {connected ? (
        <>
          <Player roomId={roomId} videoId={videoId} />
          <Chat roomId={roomId} />
          <UsersPanel roomId={roomId} />
        </>
      ) : (
        <p>⏳ Connecting...</p>
      )}
    </div>
  );
}

export default Room;