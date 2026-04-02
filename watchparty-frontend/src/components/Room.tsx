import { useEffect, useState } from "react";
import { socket } from "../socket";
import Player from "./Player";
import UsersPanel from "./UsersPanel";
import Chat from "./Chat";
import { getVideoId } from "../utils/youtube";
import type { SyncState } from "../types";

type Props = {
  roomId: string;
};

const Room = ({ roomId }: Props) => {
  const [videoId, setVideoId] = useState("dQw4w9WgXcQ");
  const [url, setUrl] = useState("");

  const changeVideo = () => {
    const id = getVideoId(url);
    if (!id) return alert("Invalid link");

    socket.emit("change_video", { roomId, videoId: id });
    setUrl("");
  };

  useEffect(() => {
    const handleSync = (data: SyncState) => {
      setVideoId(data.videoId);
    };

    socket.on("sync_state", handleSync);
    return () => socket.off("sync_state", handleSync);
  }, []);

  return (
    <div>
      <h2>Room: {roomId}</h2>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste link"
      />
      <button onClick={changeVideo}>Change</button>

      <UsersPanel roomId={roomId} />

      <Player videoId={videoId} roomId={roomId} />

      <Chat roomId={roomId} />
    </div>
  );
};

export default Room;