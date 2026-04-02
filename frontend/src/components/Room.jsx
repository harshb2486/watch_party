import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import UsersPanel from "../components/UsersPanel";

function Chat({ roomId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  // 📡 Receive messages (ONLY ONE listener)
  useEffect(() => {
    const handleMessage = (data) => {
      console.log("💬 RECEIVED:", data);

      setMessages((prev) => [...prev, data]);
    };

    socket.off("receive_message"); // 🔥 prevent duplicates
    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  // 📤 Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    console.log("📤 SENDING:", message);

    socket.emit("send_message", {
      roomId,
      message,
    });

    setMessage("");
  };
  socket.emit("join_room", {
  roomId,
  username: localStorage.getItem("username") || "Guest",
});

  // 🔽 Auto-scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>💬 Chat</h3>

      {/* 💬 Messages */}
      <div
        ref={chatRef}
        style={{
          height: "250px",
          overflowY: "auto",
          border: "1px solid gray",
          padding: "10px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <strong>{m.username}</strong>: {m.message}
            <div style={{ fontSize: "10px", color: "gray" }}>
              {m.time}
            </div>
          </div>
        ))}
      </div>

      <UsersPanel roomId={roomId} />

      {/* 💬 Input */}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        style={{ marginTop: 10, marginRight: 5 }}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;