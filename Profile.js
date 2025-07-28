import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSkills, getUserProgress } from '../utils/api';
import UserProfile from '../components/UserProfile';

/**
 * Profile page displays user info and progress summary.  It computes
 * the percentage of completed skills out of the total skills in the tree.
 */
export default function Profile({ user }) {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function computeSummary() {
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const skills = await getSkills();
        const progress = await getUserProgress(user.user_id);
        const total = skills.length;
        let completed = 0;
        skills.forEach((sk) => {
          if (progress[sk.id] === 'completed') completed += 1;
        });
        const percentage = (completed / total) * 100;
        setSummary({ completed, total, percentage });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    computeSummary();
  }, [user, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading…</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button className="mb-4 text-secondary hover:underline" onClick={() => navigate('/')}>← Back to Home</button>
      <UserProfile user={user} progressSummary={summary} />
    </div>
  );
}