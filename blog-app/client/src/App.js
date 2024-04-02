// src/App.js
import React from "react";
import Posts from "./Posts";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import CreatePost from "./CreatePost";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Blog</h1>
      </header>
      <main>
        <LoginForm />
        <RegisterForm />
        <CreatePost />
        <Posts />
      </main>
    </div>
  );
}

export default App;
