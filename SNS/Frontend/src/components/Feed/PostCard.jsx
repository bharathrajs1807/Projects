import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Share, MoreVertical, User, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { postService } from '../../services/api';
import CommentForm from './CommentForm';
import CommentReplyForm from './CommentReplyForm';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();

  if (!post || !post.author) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-gray-500">Post data is incomplete</p>
        <pre className="text-xs text-gray-400 mt-2">{JSON.stringify(post, null, 2)}</pre>
      </div>
    );
  }

  const postId = post.id || post._id;
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [isDisliked, setIsDisliked] = useState(post.isDisliked ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [dislikesCount, setDislikesCount] = useState(post.dislikesCount ?? 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [editingReply, setEditingReply] = useState({}); // { [replyId]: true }
  const [editReplyText, setEditReplyText] = useState('');

  const handleLike = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      let res;
      if (isLiked) {
        res = await postService.unlikePost(postId);
      } else {
        res = await postService.likePost(postId);
      }
      setIsLiked(res.isLiked ?? false);
      setLikesCount(res.likesCount ?? likesCount);
      setIsDisliked(res.isDisliked ?? false);
      setDislikesCount(res.dislikesCount ?? dislikesCount);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      let res;
      if (isDisliked) {
        res = await postService.undislikePost(postId);
      } else {
        res = await postService.dislikePost(postId);
      }
      setIsDisliked(res.isDisliked ?? false);
      setDislikesCount(res.dislikesCount ?? dislikesCount);
      setIsLiked(res.isLiked ?? false);
      setLikesCount(res.likesCount ?? likesCount);
    } catch (error) {
      console.error('Error disliking/undisliking post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || !postId) return;

    setLoading(true);
    try {
      await postService.updatePost(postId, editContent);
      setIsEditing(false);
      if (onUpdate && postId) {
        onUpdate(postId, editContent);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postId) {
      console.error('Post ID is missing');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(postId);
        if (onDelete && postId) {
          onDelete(postId);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  // Add new comment
  const handleCommentAdded = async (newComment) => {
    try {
      const updatedPost = await postService.getPost(postId);
      setComments(updatedPost.comments || []);
    } catch (err) {
      // fallback: add the new comment if fetch fails
      setComments(prev => [...prev, newComment]);
    }
  };

  // Start editing a comment
  const handleEditStart = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.comment);
  };

  // Save edited comment
  const handleEditSave = async (commentId) => {
    try {
      const updated = await postService.updateComment(postId, commentId, editCommentText);
      setComments(prev =>
        prev.map(c => c._id === commentId ? { ...c, comment: updated.comment } : c)
      );
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (err) {
      alert('Failed to update comment');
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await postService.deleteComment(postId, commentId);
      const updatedPost = await postService.getPost(postId);
      setComments(updatedPost.comments || []);
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  // Add reply to a comment
  const handleReplyAdded = async (commentId, newReply) => {
    try {
      const updatedPost = await postService.getPost(postId);
      setComments(updatedPost.comments || []);
    } catch (err) {
      // fallback: add the new reply if fetch fails
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        )
      );
    }
  };

  // Edit reply
  const handleEditReply = async (commentId, replyId) => {
    try {
      const updated = await postService.updateReply(postId, commentId, replyId, editReplyText);
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? {
                ...c,
                replies: c.replies.map(r =>
                  r._id === replyId ? { ...r, comment: updated.comment } : r
                ),
              }
            : c
        )
      );
      setEditingReply({});
      setEditReplyText('');
    } catch (err) {
      alert('Failed to update reply');
    }
  };

  // Delete reply
  const handleDeleteReply = async (commentId, replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await postService.deleteReply(postId, commentId, replyId);
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? { ...c, replies: c.replies.filter(r => r._id !== replyId) }
            : c
        )
      );
    } catch (err) {
      alert('Failed to delete reply');
    }
  };

  // Check if current user is comment owner
  const isCommentOwner = (comment) => user && comment.userId && (user.id === comment.userId._id || user.id === comment.userId);

  const isOwner = user?.id && post.author?.id ? user.id === post.author.id : false;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            {post.author.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.username || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.author.firstName || ''} {post.author.lastName || ''}
            </h3>
            <p className="text-sm text-gray-500">
              @{post.author.username || 'unknown'} • {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Edit Post
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content || '');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={loading || !editContent.trim()}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {post.content || 'No content'}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Like (ThumbsUp) Button */}
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              isLiked
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-500 hover:text-green-600'
            }`}
            aria-label="Like"
          >
            <ThumbsUp
              className={`w-5 h-5 transition-all duration-200 ${
                isLiked ? 'fill-current scale-110' : 'hover:scale-110'
              }`}
              fill={isLiked ? 'currentColor' : 'none'}
            />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          {/* Dislike (ThumbsDown) Button */}
          <button
            onClick={handleDislike}
            disabled={loading}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              isDisliked
                ? 'text-blue-600 hover:text-blue-700'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            aria-label="Dislike"
          >
            <ThumbsDown
              className={`w-5 h-5 transition-all duration-200 ${
                isDisliked ? 'fill-current scale-110' : 'hover:scale-110'
              }`}
              fill={isDisliked ? 'currentColor' : 'none'}
            />
            <span className="text-sm font-medium">{dislikesCount}</span>
          </button>

          {/* Comments and Share (unchanged) */}
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentsCount || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors duration-200">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="px-4 pb-2">
        {comments.length === 0 ? (
          <div className="text-gray-400 text-sm">No comments yet.</div>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment._id} className="text-sm text-gray-800 border-b border-gray-100 pb-2">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">
                    {comment.userId?.username || 'User'}:
                  </span>
                  <span>{comment.comment}</span>
                  <span className="ml-2 text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
                  {/* Only show edit/delete for comment owner */}
                  {user && comment.userId && user.id === (comment.userId._id || comment.userId) && (
                    <>
                      <button
                        onClick={() => handleEditStart(comment)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="ml-1 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </>
                  )}
                </div>
                {/* Replies Section */}
                <div className="ml-6 mt-2">
                  {comment.replies && comment.replies.length > 0 && (
                    <ul className="space-y-1">
                      {comment.replies.map((reply) => (
                        <li key={reply._id} className="flex items-center">
                          <span className="font-semibold mr-2">
                            {reply.userId?.username || 'User'}:
                          </span>
                          <span>{reply.comment}</span>
                          <span className="ml-2 text-xs text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                          {/* Only show edit/delete for reply owner */}
                          {user && reply.userId && user.id === (reply.userId._id || reply.userId) && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingReply({ [reply._id]: true });
                                  setEditReplyText(reply.comment);
                                }}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 inline" />
                              </button>
                              <button
                                onClick={() => handleDeleteReply(comment._id, reply._id)}
                                className="ml-1 text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Add Reply Form */}
                  <CommentReplyForm
                    postId={postId}
                    commentId={comment._id}
                    onReplyAdded={reply => handleReplyAdded(comment._id, reply)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="px-4 pb-4">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
};

export default PostCard;