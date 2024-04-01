// src/RegisterForm.js
import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/register", { username, password })
      .then((response) => {
        // Handle successful registration here...
        // For example, you could redirect the user to the login page
        console.log(response.data);
        window.location.href = "/login";
      })
      .catch((error) => {
        // Handle error here...
        // For example, you could display an error message
        console.error(error);
        setError("Failed to register. Please try again.");
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
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default RegisterForm;
