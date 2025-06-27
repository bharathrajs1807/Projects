import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, User, UserPlus, UserMinus } from 'lucide-react';
import { userService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery) => {
    const queryToUse = searchQuery || query;
    if (!queryToUse.trim()) return;

    setLoading(true);
    try {
      const searchResults = await userService.searchUsers(queryToUse);
      setResults(searchResults.users || searchResults || []);
      
      // Initialize following states
      const states = {};
      (searchResults.users || searchResults || []).forEach((user) => {
        states[user.id] = user.isFollowing;
      });
      setFollowingStates(states);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      handleSearch();
    }
  };

  const handleFollow = async (userId, username) => {
    try {
      const isCurrentlyFollowing = followingStates[userId];
      
      if (isCurrentlyFollowing) {
        await userService.unfollowUser(username);
      } else {
        await userService.followUser(username);
      }
      
      setFollowingStates(prev => ({
        ...prev,
        [userId]: !isCurrentlyFollowing
      }));

      // Update the results array
      setResults(prev =>
        prev.map(user =>
          user.id === userId
            ? {
                ...user,
                followersCount: isCurrentlyFollowing
                  ? user.followersCount - 1
                  : user.followersCount + 1
              }
            : user
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Users</h1>
        
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </form>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 && query ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center space-x-4 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">@{user.username}</p>
                    {user.bio && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{user.bio}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {user.followersCount} followers
                    </p>
                  </div>
                </Link>

                {currentUser?.id !== user.id && (
                  <button
                    onClick={() => handleFollow(user.id, user.username)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-4 ${
                      followingStates[user.id]
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                    }`}
                  >
                    {followingStates[user.id] ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!query && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search for users</h3>
          <p className="text-gray-500">
            Enter a username or name to find people to connect with.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;