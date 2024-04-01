// src/Post.js
import React from "react";

function Post({ post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p>Author: {post.author}</p>
    </div>
  );
}

export default Post;
