// src/api.js — sab API calls yahan se hongi
const BASE_URL = "http://localhost:5000/api";

// Token localStorage se lena
const getToken = () => localStorage.getItem("token");

// ── Auth APIs ──────────────────────────────────────────────────
export const authAPI = {
  signup: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },
};

// ── Heritage APIs ──────────────────────────────────────────────
export const heritageAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/heritage?${params}`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/heritage/${id}`);
    return res.json();
  },

  getRecommendations: async (id) => {
    const res = await fetch(`${BASE_URL}/heritage/${id}/recommendations`);
    return res.json();
  },

  search: async (query) => {
    const res = await fetch(`${BASE_URL}/heritage?search=${query}`);
    return res.json();
  },
};

// ── Favorites APIs ─────────────────────────────────────────────
export const favoritesAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  toggle: async (siteId) => {
    const res = await fetch(`${BASE_URL}/favorites/toggle/${siteId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },
};

// ── Reviews APIs ───────────────────────────────────────────────
export const reviewsAPI = {
  getReviews: async (siteId) => {
    const res = await fetch(`${BASE_URL}/reviews/${siteId}`);
    return res.json();
  },

  addReview: async (siteId, data) => {
    const res = await fetch(`${BASE_URL}/reviews/${siteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// ── Nearby APIs ────────────────────────────────────────────────
export const nearbyAPI = {
  getNearby: async (lat, lng, radius = 50) => {
    const res = await fetch(`${BASE_URL}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return res.json();
  },
};