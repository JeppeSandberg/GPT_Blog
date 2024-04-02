import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Posts from "./Posts";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import CreatePost from "./CreatePost";
import "./App.css";

function App() {
  const username = localStorage.getItem("username");

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>My Blog</h1>
          <nav>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </nav>
          {username && <p>Welcome, {username}!</p>}
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <>
                  <CreatePost />
                  <Posts />
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
