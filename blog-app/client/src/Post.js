import React, { useState } from "react";
import axios from "axios";
import Comments from "./Comments";

function Post({ post }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const userId = Number(localStorage.getItem("userId"));

  console.log(`Post userId: ${post.userId}, Logged in userId: ${userId}`);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/posts/${post.id}`, {
        title: editedTitle,
        content: editedContent,
      })
      .then(() => {
        setIsEditing(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/posts/${post.id}`)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="post">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Author: {post.author}</p>
          {post.userId === userId && (
            <>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
          <Comments postId={post.id} />
        </>
      )}
    </div>
  );
}

export default Post;
