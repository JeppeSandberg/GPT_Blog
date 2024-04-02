// src/LoginForm.js
import React, { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/login", { username, password })
      .then((response) => {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", username); // Store the username
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to login. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default LoginForm;
