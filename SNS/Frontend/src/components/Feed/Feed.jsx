import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { postService } from '../../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Test database connection first
      try {
        await postService.testDatabase();
        console.log('Database connection test passed');
      } catch (dbError) {
        console.error('Database connection test failed:', dbError);
        throw new Error('Database connection failed');
      }

      // Try to get feed first (posts from followed users), fallback to all posts
      let postsData;
      try {
        postsData = await postService.getFeed(0, 20);
        console.log('Feed received posts data:', postsData);
      } catch (feedError) {
        console.log('Feed failed, falling back to all posts:', feedError);
        // If feed fails, get all posts
        try {
          postsData = await postService.getPosts(0, 20);
          console.log('All posts received:', postsData);
        } catch (postsError) {
          console.error('Both feed and posts failed:', postsError);
          throw postsError;
        }
      }

      // Handle both array and object responses
      const postsArray = Array.isArray(postsData) ? postsData : (postsData.posts || []);
      console.log('Feed processed posts array:', postsArray);
      setPosts(postsArray);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    if (!newPost) return;
    
    console.log('Feed received new post:', newPost);
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (postId, content) => {
    if (!postId) return;
    
    setPosts(prev =>
      prev.map(post =>
        (post.id || post._id) === postId
          ? { ...post, content, updatedAt: new Date().toISOString() }
          : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    if (!postId) return;
    
    setPosts(prev => prev.filter(post => (post.id || post._id) !== postId));
  };

  const handleRefresh = () => {
    fetchPosts(true);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
        <button
          onClick={handleRefresh || (() => {})}
          disabled={refreshing}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated || (() => {})} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {(!posts || posts.length === 0) && !loading && !error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">
              Start following people or create your first post to see content here.
            </p>
          </div>
        ) : (
          posts && posts.map((post) => (
            <PostCard
              key={post.id || post._id || Math.random()}
              post={post}
              onUpdate={handlePostUpdate || (() => {})}
              onDelete={handlePostDelete || (() => {})}
            />
          ))
        )}
      </div>

      {/* Load More Button (for future pagination) */}
      {posts && posts.length > 0 && (
        <div className="text-center mt-8">
          <button 
            onClick={() => {}} // Placeholder for future pagination
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;