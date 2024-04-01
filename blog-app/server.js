// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Initialize express app
const app = express();

// Use middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
let db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});

// Create the posts table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    userId INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id)
  )
`);

// Create comments table
db.run(
  `CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postId INTEGER,
    text TEXT,
    FOREIGN KEY(postId) REFERENCES posts(id)
  )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);

// Create users table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);

db.run("ALTER TABLE posts ADD COLUMN userId INTEGER", (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run("DROP TABLE IF EXISTS new_posts", (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Define routes here...
// Get all blog posts

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const sql = "INSERT INTO users (username, password) VALUES (?,?)";
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  });
});

// Login a user
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row) {
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        if (result) {
          res.json({ id: row.id, username: row.username });
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.get("/posts", (req, res) => {
  const sql = `
      SELECT posts.id, posts.title, posts.content, users.username as author
      FROM posts
      LEFT JOIN users ON posts.userId = users.id
    `;
  db.all(sql, [], (err, posts) => {
    if (err) {
      console.log(err); // Add this line
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(posts);
  });
});

// Get a single blog post
app.get("/posts/:id", (req, res) => {
  const sql = "SELECT * FROM posts WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create a new blog post
app.post("/posts", (req, res) => {
  const { title, content, userId } = req.body;
  const sql = "INSERT INTO posts (title, content, userId) VALUES (?,?,?)";
  db.run(sql, [title, content, userId], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update a blog post
app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  const sql = "UPDATE posts SET title = ?, content = ? WHERE id = ?";
  db.run(sql, [title, content, req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Delete a blog post
app.delete("/posts/:id", (req, res) => {
  const sql = "DELETE FROM posts WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Get all comments for a blog post
app.get("/posts/:id/comments", (req, res) => {
  const sql = "SELECT * FROM comments WHERE postId = ?";
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a comment to a blog post
app.post("/posts/:id/comments", (req, res) => {
  const { text } = req.body;
  const sql = "INSERT INTO comments (postId, text) VALUES (?,?)";
  db.run(sql, [req.params.id, text], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update a comment
app.put("/comments/:id", (req, res) => {
  const { text } = req.body;
  const sql = "UPDATE comments SET text = ? WHERE id = ?";
  db.run(sql, [text, req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Delete a comment
app.delete("/comments/:id", (req, res) => {
  const sql = "DELETE FROM comments WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});
// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
