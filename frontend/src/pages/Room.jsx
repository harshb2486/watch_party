import { useEffect, useState } from "react";
import socket from "../socket";
import Player from "../components/Player";
import Chat from "../components/Chat";
import UsersPanel from "../components/UsersPanel";

function Room({ roomId, user }) {
  const [connected, setConnected] = useState(false);
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ");

  useEffect(() => {
      if (!socket.connected) {
    socket.connect();
  }

    // 🔐 LOGIN
    socket.emit("login", { username: user }, (res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }

      // 👥 JOIN ROOM (send username 🔥)
      socket.emit(
        "join_room",
        { roomId, username: user },
        (res) => {
          if (res.error) {
            console.log(res.error);
          } else {
            setConnected(true);
          }
        }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, user]);

  // 🎬 VIDEO SYNC
  useEffect(() => {
    const handleSync = ({ videoId }) => {
      console.log("SYNC RECEIVED:", videoId);
      setVideoId(videoId);
    };

    socket.off("sync_state");
    socket.on("sync_state", handleSync);

    return () => socket.off("sync_state", handleSync);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🎬 Room: {roomId}</h2>
      <h3>👤 User: {user}</h3>

      {connected ? (
        <>
          {/* 🎥 Player */}
          <Player roomId={roomId} videoId={videoId} />

          {/* 💬 Chat */}
          <Chat roomId={roomId} />

          {/* 👥 Users */}
          <UsersPanel roomId={roomId} />
        </>
      ) : (
        <p>⏳ Connecting...</p>
      )}
    </div>
  );
}

export default Room;
