import React, { useState } from 'react';
import { postService } from '../../services/api';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    try {
      const newComment = await postService.addComment(postId, comment);
      setComment('');
      setError('');
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mt-2">
      <input
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
        Comment
      </button>
      {error && <div className="text-red-500 ml-2">{error}</div>}
    </form>
  );
};

export default CommentForm;