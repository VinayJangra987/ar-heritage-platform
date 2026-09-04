
// // ============================================================
// // API BASE URL
// // ============================================================

// const API_BASE = "https://ar-heritage-platform.onrender.com";

// // ============================================================
// // HELPER: API REQUEST WITH TOKEN
// // ============================================================

// const apiFetch = async (endpoint, options = {}) => {
//   const token = localStorage.getItem("token");

//   const headers = {
//     "Content-Type": "application/json",
//     ...options.headers,
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const response = await fetch(
//     `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
//     {
//       ...options,
//       headers,
//     }
//   );

//   let data;

//   try {
//     data = await response.json();
//   } catch {
//     data = {};
//   }

//   if (!response.ok) {
//     throw new Error(
//       data.message || `HTTP Error: ${response.status}`
//     );
//   }

//   return data;
// };

// // ============================================================
// // AUTH APIs
// // ============================================================

// export const authAPI = {
//   login: async (email, password) => {
//     return apiFetch("/api/auth/login", {
//       method: "POST",
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     });
//   },

//   signup: async (name, email, password) => {
//     return apiFetch("/api/auth/signup", {
//       method: "POST",
//       body: JSON.stringify({
//         name,
//         email,
//         password,
//       }),
//     });
//   },

//   getMe: async () => {
//     return apiFetch("/api/auth/me", {
//       method: "GET",
//     });
//   },

//   updateProfile: async (updates) => {
//     return apiFetch("/api/auth/update-profile", {
//       method: "PATCH",
//       body: JSON.stringify(updates),
//     });
//   },

//   changePassword: async (currentPassword, newPassword) => {
//     return apiFetch("/api/auth/change-password", {
//       method: "POST",
//       body: JSON.stringify({
//         currentPassword,
//         newPassword,
//       }),
//     });
//   },

//   forgotPassword: async (email) => {
//     return apiFetch("/api/auth/forgot-password", {
//       method: "POST",
//       body: JSON.stringify({
//         email,
//       }),
//     });
//   },

//   verifyResetOtp: async (email, otp) => {
//     return apiFetch("/api/auth/verify-reset-otp", {
//       method: "POST",
//       body: JSON.stringify({
//         email,
//         otp,
//       }),
//     });
//   },

//   resetPassword: async (resetToken, newPassword) => {
//     return apiFetch("/api/auth/reset-password", {
//       method: "POST",
//       body: JSON.stringify({
//         resetToken,
//         newPassword,
//       }),
//     });
//   },

//   verifyOTP: async (email, otp) => {
//     return apiFetch("/api/auth/verify-otp", {
//       method: "POST",
//       body: JSON.stringify({
//         email,
//         otp,
//       }),
//     });
//   },

//   resendOTP: async (email) => {
//     return apiFetch("/api/auth/resend-otp", {
//       method: "POST",
//       body: JSON.stringify({
//         email,
//       }),
//     });
//   },
// };

// // ============================================================
// // FAVORITES APIs
// // ============================================================

// export const favoritesAPI = {
//   getAll: async () => {
//     return apiFetch("/api/favorites", {
//       method: "GET",
//     });
//   },

//   toggle: async (siteId) => {
//     return apiFetch("/api/favorites/toggle", {
//       method: "POST",
//       body: JSON.stringify({
//         siteId,
//       }),
//     });
//   },

//   add: async (siteId) => {
//     return apiFetch("/api/favorites", {
//       method: "POST",
//       body: JSON.stringify({
//         siteId,
//       }),
//     });
//   },

//   remove: async (siteId) => {
//     return apiFetch(`/api/favorites/${siteId}`, {
//       method: "DELETE",
//     });
//   },
// };

// // ============================================================
// // HERITAGE SITES APIs
// // ============================================================

// export const heritageAPI = {
//   getAll: async () => {
//     return apiFetch("/api/heritage-sites", {
//       method: "GET",
//     });
//   },

//   getById: async (id) => {
//     return apiFetch(`/api/heritage-sites/${id}`, {
//       method: "GET",
//     });
//   },

//   search: async (query) => {
//     return apiFetch(
//       `/api/heritage-sites/search?q=${encodeURIComponent(query)}`,
//       {
//         method: "GET",
//       }
//     );
//   },

//   filter: async (filters) => {
//     const params = new URLSearchParams(filters).toString();

//     return apiFetch(`/api/heritage-sites/filter?${params}`, {
//       method: "GET",
//     });
//   },

//   create: async (siteData) => {
//     return apiFetch("/api/heritage-sites", {
//       method: "POST",
//       body: JSON.stringify(siteData),
//     });
//   },

//   update: async (id, siteData) => {
//     return apiFetch(`/api/heritage-sites/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(siteData),
//     });
//   },

//   delete: async (id) => {
//     return apiFetch(`/api/heritage-sites/${id}`, {
//       method: "DELETE",
//     });
//   },
// };

// // ============================================================
// // REVIEWS APIs
// // ============================================================

// export const reviewsAPI = {
//   getBySite: async (siteId) => {
//     return apiFetch(`/api/reviews/site/${siteId}`, {
//       method: "GET",
//     });
//   },

//   create: async (siteId, reviewData) => {
//     return apiFetch("/api/reviews", {
//       method: "POST",
//       body: JSON.stringify({
//         siteId,
//         ...reviewData,
//       }),
//     });
//   },

//   update: async (reviewId, reviewData) => {
//     return apiFetch(`/api/reviews/${reviewId}`, {
//       method: "PATCH",
//       body: JSON.stringify(reviewData),
//     });
//   },

//   delete: async (reviewId) => {
//     return apiFetch(`/api/reviews/${reviewId}`, {
//       method: "DELETE",
//     });
//   },
// };

// // ============================================================
// // TOURS APIs
// // ============================================================

// export const toursAPI = {
//   getAll: async () => {
//     return apiFetch("/api/tours", {
//       method: "GET",
//     });
//   },

//   getById: async (id) => {
//     return apiFetch(`/api/tours/${id}`, {
//       method: "GET",
//     });
//   },

//   create: async (tourData) => {
//     return apiFetch("/api/tours", {
//       method: "POST",
//       body: JSON.stringify(tourData),
//     });
//   },

//   update: async (id, tourData) => {
//     return apiFetch(`/api/tours/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(tourData),
//     });
//   },

//   delete: async (id) => {
//     return apiFetch(`/api/tours/${id}`, {
//       method: "DELETE",
//     });
//   },

//   book: async (tourId, bookingData) => {
//     return apiFetch("/api/tours/book", {
//       method: "POST",
//       body: JSON.stringify({
//         tourId,
//         ...bookingData,
//       }),
//     });
//   },
// };

// // ============================================================
// // DEFAULT EXPORT
// // ============================================================

// const apiExports = {
//   authAPI,
//   favoritesAPI,
//   heritageAPI,
//   reviewsAPI,
//   toursAPI,
// };

// export default apiExports;


// ============================================================
// API BASE URL
// ============================================================

const API_BASE = "https://ar-heritage-platform.onrender.com";

// ============================================================
// HELPER: API REQUEST WITH TOKEN (JSON body)
// ============================================================

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
    {
      ...options,
      headers,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || `HTTP Error: ${response.status}`
    );
  }

  return data;
};

// ============================================================
// HELPER: API REQUEST WITH TOKEN (FormData body — for file uploads)
// Content-Type header NAHI set karte — browser khud boundary ke saath set karega
// ============================================================

const apiFetchFormData = async (endpoint, formData, method = "POST") => {
  const token = localStorage.getItem("token");

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
    {
      method,
      headers,
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || `HTTP Error: ${response.status}`
    );
  }

  return data;
};

// ============================================================
// AUTH APIs
// ============================================================

export const authAPI = {
  login: async (email, password) => {
    return apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  signup: async (name, email, password) => {
    return apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
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
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
  },

  forgotPassword: async (email) => {
    return apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
  },

  verifyResetOtp: async (email, otp) => {
    return apiFetch("/api/auth/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
      }),
    });
  },

  resetPassword: async (resetToken, newPassword) => {
    return apiFetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        resetToken,
        newPassword,
      }),
    });
  },

  verifyOTP: async (email, otp) => {
    return apiFetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
      }),
    });
  },

  resendOTP: async (email) => {
    return apiFetch("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
  },
};

// ============================================================
// FAVORITES APIs
// ============================================================

export const favoritesAPI = {
  getAll: async () => {
    return apiFetch("/api/favorites", {
      method: "GET",
    });
  },

  toggle: async (siteId) => {
    return apiFetch("/api/favorites/toggle", {
      method: "POST",
      body: JSON.stringify({
        siteId,
      }),
    });
  },

  add: async (siteId) => {
    return apiFetch("/api/favorites", {
      method: "POST",
      body: JSON.stringify({
        siteId,
      }),
    });
  },

  remove: async (siteId) => {
    return apiFetch(`/api/favorites/${siteId}`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// HERITAGE SITES APIs
// ============================================================

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
    return apiFetch(
      `/api/heritage-sites/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
      }
    );
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

// ============================================================
// REVIEWS APIs
// Backend routes: GET /api/reviews/:siteId, POST /api/reviews/:siteId,
// DELETE /api/reviews/:reviewId, PATCH /api/reviews/:reviewId/like
// ============================================================

export const reviewsAPI = {
  // Get all reviews for a site
  getReviews: async (siteId) => {
    return apiFetch(`/api/reviews/${siteId}`, {
      method: "GET",
    });
  },

  // Add a review — supports optional image files
  addReview: async (siteId, { rating, title, comment, images, visitedViaAR, visitedViaVirtualTour }) => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("title", title || "");
    formData.append("comment", comment);
    if (visitedViaAR !== undefined) formData.append("visitedViaAR", visitedViaAR);
    if (visitedViaVirtualTour !== undefined) formData.append("visitedViaVirtualTour", visitedViaVirtualTour);

    if (images?.length) {
      images.forEach((img) => formData.append("images", img));
    }

    return apiFetchFormData(`/api/reviews/${siteId}`, formData, "POST");
  },

  deleteReview: async (reviewId) => {
    return apiFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  likeReview: async (reviewId) => {
    return apiFetch(`/api/reviews/${reviewId}/like`, {
      method: "PATCH",
    });
  },
};

// ============================================================
// TOURS APIs
// ============================================================

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
      body: JSON.stringify({
        tourId,
        ...bookingData,
      }),
    });
  },
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

const apiExports = {
  authAPI,
  favoritesAPI,
  heritageAPI,
  reviewsAPI,
  toursAPI,
};

export default apiExports;