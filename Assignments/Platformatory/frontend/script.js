// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Handle Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store the complete user data from server response
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      // Redirect to profile page
      window.location.href = "profile.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the complete user data from server including _id
      localStorage.setItem("currentUser", JSON.stringify(data));
      window.location.href = "profile.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Check authentication and redirect if needed
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (location.pathname.includes("profile") && !currentUser) {
  window.location.href = "login.html";
}

// Display user information
function displayUserInfo() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  // Display logged-in user's name
  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.innerText = user.firstName || "";
  }

  // Pre-fill profile form
  const formFields = ["firstName", "lastName", "phone", "city", "pincode"];
  formFields.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.value = user[id] || "";
    }
  });
}

// Call displayUserInfo when the page loads
document.addEventListener('DOMContentLoaded', displayUserInfo);

// Handle Profile Edit
const editProfileForm = document.getElementById("editProfileForm");
if (editProfileForm) {
  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    
    if (!currentUser || !currentUser._id) {
      alert("User session expired. Please login again.");
      window.location.href = "login.html";
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed');
      }

      // Update the stored user data with the response from server
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      // Refresh the displayed user info
      displayUserInfo();
      
      alert("Profile updated successfully");
    } catch (error) {
      alert(error.message);
    }
  });
}

// Logout Function
async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage and redirect
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}
