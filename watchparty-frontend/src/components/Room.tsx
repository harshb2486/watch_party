import { useEffect, useState } from "react";
import { socket } from "../socket";
import Player from "./Player";
import type { SyncState, ChatMessage } from "../types";

type Props = {
  roomId: string;
};

const Room = ({ roomId }: Props) => {
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ");
  const [url, setUrl] = useState("");

  // 💬 CHAT STATE
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msg, setMsg] = useState("");

  // 🎯 Extract YouTube ID
  function getVideoId(url: string): string | null {
    try {
      if (url.length === 11) return url;

      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.slice(1);
      }

      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }

      if (parsed.pathname.includes("/embed/")) {
        return parsed.pathname.split("/embed/")[1];
      }

      if (parsed.pathname.includes("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1];
      }

      return null;
    } catch {
      return null;
    }
  }

  // 🎬 Change video
  const changeVideo = () => {
    const id = getVideoId(url);

    if (!id) {
      alert("Invalid YouTube link");
      return;
    }

    socket.emit("change_video", { roomId, videoId: id });
    setUrl("");
  };

  // 🔁 Sync video
  useEffect(() => {
    const handleSync = (data: SyncState) => {
      setVideoId(data.videoId);
    };

    socket.on("sync_state", handleSync);

    return () => {
      socket.off("sync_state", handleSync);
    };
  }, []);

  // 💬 Receive messages
  useEffect(() => {
    const handleMessage = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  // 💬 Send message
  const sendMessage = () => {
    if (!msg.trim()) return;

    socket.emit("send_message", { roomId, message: msg });
    setMsg("");
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>

      {/* 🎬 VIDEO CONTROL */}
      <input
        placeholder="Paste YouTube link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={changeVideo}>Change Video</button>

      <Player videoId={videoId} roomId={roomId} />

      {/* 💬 CHAT UI */}
      <div style={{ marginTop: 20 }}>
        <h3>💬 Chat</h3>

        <div
          style={{
            height: "200px",
            overflowY: "scroll",
            border: "1px solid gray",
            padding: "10px",
          }}
        >
          {messages.map((m, i) => (
            <div key={i}>
              <strong>{m.username}</strong>: {m.message} ({m.time})
            </div>
          ))}
        </div>

        <input
          placeholder="Type message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Room;