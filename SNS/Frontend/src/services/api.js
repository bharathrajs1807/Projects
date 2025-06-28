const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Always send cookies
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/log-in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.request('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(refreshToken) {
    return this.request('/auth/log-out', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async testDatabase() {
    return this.request('/test');
  }

  // User endpoints
  async getUserProfile(username) {
    return this.request(`/user/${username}`);
  }

  async updateUserProfile(username, userData) {
    return this.request(`/user/${username}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async followUser(username) {
    return this.request(`/user/${username}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(username) {
    return this.request(`/user/${username}/unfollow`, {
      method: 'POST',
    });
  }

  async searchUsers(query) {
    return this.request(`/user/search?query=${encodeURIComponent(query)}`);
  }

  // Post endpoints
  async getPosts(skip = 0, limit = 10) {
    return this.request(`/post?skip=${skip}&limit=${limit}`);
  }

  async getPost(postId, commentSkip = 0, commentLimit = 10) {
    return this.request(`/post/${postId}?commentSkip=${commentSkip}&commentLimit=${commentLimit}`);
  }

  async createPost(content) {
    return this.request('/post', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async updatePost(postId, content) {
    return this.request(`/post/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deletePost(postId) {
    return this.request(`/post/${postId}`, {
      method: 'DELETE',
    });
  }

  // Feed endpoint
  async getFeed(skip = 0, limit = 10) {
    return this.request(`/post/wall?skip=${skip}&limit=${limit}`);
  }

  // Post reactions
  async likePost(postId) {
    return this.request(`/post/${postId}/like`, {
      method: 'POST',
    });
  }

  async unlikePost(postId) {
    return this.request(`/post/${postId}/unlike`, {
      method: 'POST',
    });
  }

  async dislikePost(postId) {
    return this.request(`/post/${postId}/dislike`, {
      method: 'POST',
    });
  }

  async undislikePost(postId) {
    return this.request(`/post/${postId}/undislike`, {
      method: 'POST',
    });
  }

  // Comments
  async addComment(postId, comment) {
    return this.request(`/post/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async updateComment(postId, commentId, comment) {
    return this.request(`/post/${postId}/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ comment }),
    });
  }

  async deleteComment(postId, commentId) {
    return this.request(`/post/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Replies
  async addReply(postId, commentId, comment) {
    return this.request(`/post/${postId}/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async updateReply(postId, commentId, replyId, comment) {
    return this.request(`/post/${postId}/comments/${commentId}/replies/${replyId}`, {
      method: 'PATCH',
      body: JSON.stringify({ comment }),
    });
  }

  async deleteReply(postId, commentId, replyId) {
    return this.request(`/post/${postId}/comments/${commentId}/replies/${replyId}`, {
      method: 'DELETE',
    });
  }

  async getPostsByUsername(username) {
    return this.request(`/posts/user/${username}`, { method: 'GET' });
  }
}

export const authService = new ApiService();
export const userService = new ApiService();
export const postService = new ApiService();
export default new ApiService();