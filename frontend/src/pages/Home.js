import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSkills, getUserProgress, updateUserProgress } from '../utils/api';
import SkillNode from '../components/SkillNode';
import SkillPanel from '../components/SkillPanel';

/**
 * Home page renders the interactive skill tree.  Skills are fetched from
 * the server and rendered as hexagonal nodes.  A selected node will
 * display a panel with details and allow the user to change its status.
 */
export default function Home({ user, setUser }) {
  const [skills, setSkills] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedSkill, setSelectedSkill] = useState(null);
  const navigate = useNavigate();

  // Fetch skills and user progress on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);
        if (user) {
          const progressData = await getUserProgress(user.user_id);
          setProgress(progressData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [user]);

  // Handler for when a skill node is clicked
  const handleNodeClick = (skill) => {
    setSelectedSkill(skill);
  };

  // Handler to update progress on a skill
  const handleUpdateStatus = async (skillId, newStatus) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const updates = { skillId, status: newStatus };
      const updated = await updateUserProgress(user.user_id, updates);
      setProgress((prev) => ({ ...prev, [skillId]: updated.status }));
      // update local state of selected skill
      setSelectedSkill((prev) => (prev && prev.id === skillId ? { ...prev, status: updated.status } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Skill Tree</h1>
        {user ? (
          <button
            className="bg-secondary text-white px-4 py-2 rounded"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
        ) : (
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </header>
      {/* Skill Tree Grid */}
      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {skills.map((skill) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            status={progress[skill.id] || 'locked'}
            onClick={() => handleNodeClick(skill)}
          />
        ))}
      </div>
      {/* Detail Panel */}
      {selectedSkill && (
        <SkillPanel
          skill={selectedSkill}
          status={progress[selectedSkill.id] || 'locked'}
          onClose={() => setSelectedSkill(null)}
          onStatusChange={handleUpdateStatus}
        />
      )}
    </div>
  );
}
