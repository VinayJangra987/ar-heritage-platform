// src/context/AdminContext.js
import { createContext, useContext, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [monuments, setMonuments] = useState([]);

  const login = (userData) => setAdminUser(userData);
  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    adminUser,
    setAdminUser,
    monuments,
    setMonuments,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// 3. Custom hook banao — ye consume karna aasan banata hai
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }
  return context;
}