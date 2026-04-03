import { io } from "socket.io-client";

const socket = io("https://watch-party-3.onrender.com/", {
  autoConnect: false,
});

export default socket;