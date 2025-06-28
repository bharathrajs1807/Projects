import React, { useState } from 'react';
import { postService } from '../../services/api';

const CommentReplyForm = ({ postId, commentId, onReplyAdded }) => {
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      setError('Reply cannot be empty');
      return;
    }
    try {
      const newReply = await postService.addReply(postId, commentId, reply);
      setReply('');
      setError('');
      if (onReplyAdded) onReplyAdded(newReply);
    } catch (err) {
      setError('Failed to add reply');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mt-2">
      <input
        value={reply}
        onChange={e => setReply(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Reply
      </button>
      {error && <div className="text-red-500 ml-2">{error}</div>}
    </form>
  );
};

export default CommentReplyForm;