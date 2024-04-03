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
  const userId = Number(localStorage.getItem("userId"));
  const handleEdit = (commentId, newText) => {
    axios
      .put(`http://localhost:5000/comments/${commentId}`, { text: newText })
      .then(fetchComments)
      .catch(console.error);
  };
  const handleDelete = (commentId) => {
    axios
      .delete(`http://localhost:5000/comments/${commentId}`)
      .then(fetchComments)
      .catch(console.error);
  };
  return (
    <div>
      <h2>Comments</h2>
      {comments.map((comment) => {
        console.log(`Comment userId: ${comment.userId}`);
        return (
          <div key={comment.id} className="comment">
            <p className="comment-author">Author: {comment.author}</p>
            <p className="comment-text">{comment.text}</p>
            {comment.userId === userId && (
              <>
                <button onClick={() => handleEdit(comment.id, comment.text)}>Edit</button>
                <button onClick={() => handleDelete(comment.id)}>Delete</button>
              </>
            )}
          </div>
        );
      })}
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="New comment"
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

export default Comments;
