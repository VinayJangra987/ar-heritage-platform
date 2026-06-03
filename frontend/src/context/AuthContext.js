// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const stored = localStorage.getItem('ar_heritage_user');
//     if (stored) setUser(JSON.parse(stored));
//     setLoading(false);
//   }, []);

//   const signup = (name, email, password) => {
//     const users = JSON.parse(localStorage.getItem('ar_heritage_users') || '[]');
//     if (users.find(u => u.email === email)) {
//       return { success: false, error: 'Email already registered!' };
//     }
//     const newUser = { id: Date.now(), name, email, password, joinedAt: new Date().toISOString(), favorites: [] };
//     users.push(newUser);
//     localStorage.setItem('ar_heritage_users', JSON.stringify(users));
//     const { password: _, ...safeUser } = newUser;
//     localStorage.setItem('ar_heritage_user', JSON.stringify(safeUser));
//     setUser(safeUser);
//     return { success: true };
//   };

//   const login = (email, password) => {
//     const users = JSON.parse(localStorage.getItem('ar_heritage_users') || '[]');
//     const found = users.find(u => u.email === email && u.password === password);
//     if (!found) return { success: false, error: 'Invalid email or password!' };
//     const { password: _, ...safeUser } = found;
//     localStorage.setItem('ar_heritage_user', JSON.stringify(safeUser));
//     setUser(safeUser);
//     return { success: true };
//   };

//   const logout = () => {
//     localStorage.removeItem('ar_heritage_user');
//     setUser(null);
//   };

//   const toggleFavorite = (siteId) => {
//     if (!user) return;
//     const users = JSON.parse(localStorage.getItem('ar_heritage_users') || '[]');
//     const idx = users.findIndex(u => u.id === user.id);
//     if (idx === -1) return;
//     const favs = users[idx].favorites || [];
//     users[idx].favorites = favs.includes(siteId)
//       ? favs.filter(f => f !== siteId)
//       : [...favs, siteId];
//     localStorage.setItem('ar_heritage_users', JSON.stringify(users));
//     const { password: _, ...safeUser } = users[idx];
//     localStorage.setItem('ar_heritage_user', JSON.stringify(safeUser));
//     setUser(safeUser);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signup, login, logout, toggleFavorite }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };


import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, favoritesAPI } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // App start hone pe check karo — token hai toh user load karo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI.getMe().then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Signup
  const signup = async (name, email, password) => {
    const data = await authAPI.signup(name, email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }
    return data;
  };

  // Login
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }
    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Toggle Favorite
  const toggleFavorite = async (siteId) => {
    if (!user) return;
    const data = await favoritesAPI.toggle(siteId);
    if (data.favorites) {
      setUser((prev) => ({ ...prev, favorites: data.favorites }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);