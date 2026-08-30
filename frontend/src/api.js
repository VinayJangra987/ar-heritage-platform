// API Base URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper: API request with token
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error: ${response.status}`);
  }

  return data;
};

// ============= AUTH APIs =============
export const authAPI = {
  login: async (email, password) => {
    return apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (name, email, password) => {
    return apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  getMe: async () => {
    return apiFetch("/api/auth/me", {
      method: "GET",
    });
  },

  updateProfile: async (updates) => {
    return apiFetch("/api/auth/update-profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiFetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  forgotPassword: async (email) => {
    return apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyResetOtp: async (email, otp) => {
    return apiFetch("/api/auth/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (resetToken, newPassword) => {
    return apiFetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ resetToken, newPassword }),
    });
  },

  verifyOTP: async (email, otp) => {
    return apiFetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  resendOTP: async (email) => {
    return apiFetch("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// ============= FAVORITES APIs =============
export const favoritesAPI = {
  getAll: async () => {
    return apiFetch("/api/favorites", {
      method: "GET",
    });
  },

  toggle: async (siteId) => {
    return apiFetch("/api/favorites/toggle", {
      method: "POST",
      body: JSON.stringify({ siteId }),
    });
  },

  add: async (siteId) => {
    return apiFetch("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ siteId }),
    });
  },

  remove: async (siteId) => {
    return apiFetch(`/api/favorites/${siteId}`, {
      method: "DELETE",
    });
  },
};

// ============= HERITAGE SITES APIs =============
export const heritageAPI = {
  getAll: async () => {
    return apiFetch("/api/heritage-sites", {
      method: "GET",
    });
  },

  getById: async (id) => {
    return apiFetch(`/api/heritage-sites/${id}`, {
      method: "GET",
    });
  },

  search: async (query) => {
    return apiFetch(`/api/heritage-sites/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
    });
  },

  filter: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    return apiFetch(`/api/heritage-sites/filter?${params}`, {
      method: "GET",
    });
  },

  create: async (siteData) => {
    return apiFetch("/api/heritage-sites", {
      method: "POST",
      body: JSON.stringify(siteData),
    });
  },

  update: async (id, siteData) => {
    return apiFetch(`/api/heritage-sites/${id}`, {
      method: "PATCH",
      body: JSON.stringify(siteData),
    });
  },

  delete: async (id) => {
    return apiFetch(`/api/heritage-sites/${id}`, {
      method: "DELETE",
    });
  },
};

// ============= REVIEWS APIs =============
export const reviewsAPI = {
  getBySite: async (siteId) => {
    return apiFetch(`/api/reviews/site/${siteId}`, {
      method: "GET",
    });
  },

  create: async (siteId, reviewData) => {
    return apiFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ siteId, ...reviewData }),
    });
  },

  update: async (reviewId, reviewData) => {
    return apiFetch(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify(reviewData),
    });
  },

  delete: async (reviewId) => {
    return apiFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },
};

// ============= TOURS APIs =============
export const toursAPI = {
  getAll: async () => {
    return apiFetch("/api/tours", {
      method: "GET",
    });
  },

  getById: async (id) => {
    return apiFetch(`/api/tours/${id}`, {
      method: "GET",
    });
  },

  create: async (tourData) => {
    return apiFetch("/api/tours", {
      method: "POST",
      body: JSON.stringify(tourData),
    });
  },

  update: async (id, tourData) => {
    return apiFetch(`/api/tours/${id}`, {
      method: "PATCH",
      body: JSON.stringify(tourData),
    });
  },

  delete: async (id) => {
    return apiFetch(`/api/tours/${id}`, {
      method: "DELETE",
    });
  },

  book: async (tourId, bookingData) => {
    return apiFetch("/api/tours/book", {
      method: "POST",
      body: JSON.stringify({ tourId, ...bookingData }),
    });
  },
};

const apiExports = {
  authAPI,
  favoritesAPI,
  heritageAPI,
  reviewsAPI,
  toursAPI,
};
export default apiExports;