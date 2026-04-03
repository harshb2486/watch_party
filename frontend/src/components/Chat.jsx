import { useEffect, useState } from "react";
import socket from "../socket";

function Chat({ roomId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 📡 Receive messages
useEffect(() => {
  console.log("Chat mounted");

  const handleMessage = (data) => {
    console.log("💬 RECEIVED:", data);
    setMessages((prev) => [...prev, data]);
  };

  socket.on("receive_message", handleMessage);

  return () => {
    socket.off("receive_message", handleMessage);
  };
}, []);


  // 📤 Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    console.log("📤 SENDING:", message); // debug

    socket.emit("send_message", {
      roomId,
      message,
    });

    setMessage("");
  };
 
  
  return (
    <div style={{ marginTop: 20 }}>
      <h3>💬 Chat</h3>

      <div
        style={{
          height: "250px",
          overflowY: "auto",
          border: "1px solid gray",
          padding: "10px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.username}</strong>: {m.message}
            <div style={{ fontSize: "10px", color: "gray" }}>
              {m.time}
            </div>
          </div>
        ))}
      </div>

      <input
        value={message} // ✅ FIXED
        onChange={(e) => setMessage(e.target.value)} // ✅ FIXED
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;