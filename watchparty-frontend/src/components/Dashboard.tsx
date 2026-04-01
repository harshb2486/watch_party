type Props = {
  username: string;
  setRoomId: (id: string) => void;
  createRoom: () => void;
  joinRoom: () => void;
};

const Dashboard = ({ username, setRoomId, createRoom, joinRoom }: Props) => {
  return (
    <>
      <h2>Welcome {username}</h2>

      <button onClick={createRoom}>Create Room</button>

      <br /><br />

      <input
        placeholder="Enter Room ID"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </>
  );
};

export default Dashboard;