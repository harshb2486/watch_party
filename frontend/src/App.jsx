import { useState } from "react";
import Auth from "./pages/Auth";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);

  if (!user) return <Auth setUser={setUser} />;

  if (!roomId) return <Lobby setRoomId={setRoomId} />;

  return <Room roomId={roomId} user={user} />;
}

export default App;