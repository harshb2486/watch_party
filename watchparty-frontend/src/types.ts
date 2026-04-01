export type User = {
  id: string;
  username: string;
  role: "host" | "moderator" | "participant" | "viewer";
};

export type SyncState = {
  videoId: string;
  isPlaying: boolean;
  time: number;
};

export type ApiResponse = {
  success?: boolean;
  error?: string;
  roomId?: string;
};

export type ChatMessage = {
  username: string;
  message: string;
  time: string;
};