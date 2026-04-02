import { useEffect, useRef } from "react";

function Player({ videoId }) {
  const playerRef = useRef(null);

  useEffect(() => {
    const loadPlayer = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "360",
        width: "640",
        videoId: videoId,
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }
  }, []);

  // 🔥 IMPORTANT: update video when videoId changes
  useEffect(() => {
    if (playerRef.current && videoId) {
      console.log("LOADING VIDEO:", videoId);
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  return <div id="player"></div>;
}

export default Player;