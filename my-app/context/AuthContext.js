// src/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('don_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            username: decoded.sub,
            role: decoded.role,
            token,
          });
        } else {
          localStorage.removeItem('don_token');
        }
      } catch (err) {
        console.error('Invalid token format');
        localStorage.removeItem('don_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('don_token', token);
    const decoded = jwtDecode(token);
    setUser({
      username: decoded.sub,
      role: decoded.role,
      token,
    });
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('don_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);