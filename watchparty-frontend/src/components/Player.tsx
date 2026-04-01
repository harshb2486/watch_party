import YouTube from "react-youtube";
import type { YouTubeProps } from "react-youtube";
import { socket } from "../socket";
import { useRef, useEffect } from "react";

type Props = {
  videoId: string;
  roomId: string;
};

const Player = ({ videoId, roomId }: Props) => {
  const playerRef = useRef<any>(null);
  const isSyncing = useRef(false);
  const lastState = useRef<number | null>(null);

  // 🎬 Player Ready
  const onReady: YouTubeProps["onReady"] = (e) => {
    playerRef.current = e.target;
  };

  // 🎬 Detect User Actions
  const onStateChange: YouTubeProps["onStateChange"] = (e) => {
    if (isSyncing.current) return;

    if (lastState.current === e.data) return; // prevent duplicate
    lastState.current = e.data;

    if (e.data === 1) {
      socket.emit("play", { roomId });
      console.log("sahi hai");
    } else if (e.data === 2) {
        console.log("hooo pause hai")
      socket.emit("pause", { roomId });
    }
  };

  // 🔁 Load new video when videoId changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  // 🔁 Socket listeners
  useEffect(() => {
    const handlePlay = () => {
      isSyncing.current = true;
      playerRef.current?.playVideo();
      setTimeout(() => (isSyncing.current = false), 300);
    };

    const handlePause = () => {
      isSyncing.current = true;
      playerRef.current?.pauseVideo();
      setTimeout(() => (isSyncing.current = false), 300);
    };

    const handleSeek = ({ time }: { time: number }) => {
      playerRef.current?.seekTo(time);
    };

    socket.on("play", handlePlay);
    socket.on("pause", handlePause);
    socket.on("seek", handleSeek);

    return () => {
      socket.off("play", handlePlay);
      socket.off("pause", handlePause);
      socket.off("seek", handleSeek);
    };
  }, [roomId]);

  return (
    <YouTube
      videoId={videoId}
      opts={{
        width: "700",
        height: "400",
        playerVars: {
          origin: window.location.origin,
        },
      }}
      onReady={onReady}
      onStateChange={onStateChange}
    />
  );
};

export default Player;