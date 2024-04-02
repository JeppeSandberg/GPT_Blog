import React, { useState, useEffect } from "react";
import axios from "axios";

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = () => {
    axios
      .get(`http://localhost:5000/posts/${postId}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`http://localhost:5000/posts/${postId}/comments`, {
        text: newComment,
        userId: localStorage.getItem("userId"), // Get the userId from localStorage
      })
      .then(() => {
        setNewComment("");
        fetchComments();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
          <p>Author: {comment.author}</p>
        </div>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="New comment"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Comments;
