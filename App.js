import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { getCurrentUser } from './utils/api';

/**
 * The top‑level application component.  Handles routing and user session persistence.
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // attempt to fetch current user on mount
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        // user is not logged in; redirect to login page on protected routes
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">Loading…</div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} setUser={setUser} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
    </Routes>
  );
}