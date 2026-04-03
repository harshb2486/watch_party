import { useState } from "react";

function Auth({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.success ? "Registered!" : data.error);
  };

  const login = async () => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    console.log(data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(username);
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h2>Register/login</h2>

      <input placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Auth;