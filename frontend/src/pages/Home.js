import React, { useEffect, useState } from 'react';
import { getSkills } from '../utils/api';
import SkillNode from '../components/SkillNode';
import SkillPanel from '../components/SkillPanel';

/**
 * Home page renders the interactive skill tree. Skills are fetched from
 * the server and rendered as hexagonal nodes. A selected node will
 * display a panel with details and allow the user to change its status.
 * This simplified version does not use authentication or load user progress.
 */
export default function Home({ user, setUser }) {
  const [skills, setSkills] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Fetch skills on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // Update local progress when user toggles a skill
  async function handleUpdateStatus(skill) {
    const currentStatus = progress[skill.id] || 'not_started';
    let newStatus;
    if (currentStatus === 'not_started') {
      newStatus = 'in_progress';
    } else if (currentStatus === 'in_progress') {
      newStatus = 'completed';
    } else {
      newStatus = 'not_started';
    }
    setProgress({ ...progress, [skill.id]: newStatus });
  }

  return (
    <>
      {/* main skill tree */}
      <div className="skill-tree">
        {skills.map((skill) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            status={progress[skill.id] || 'not_started'}
            onClick={() => setSelectedSkill(skill)}
          />
        ))}
      </div>
      {/* show panel if a skill is selected */}
      {selectedSkill && (
        <SkillPanel
          skill={selectedSkill}
          status={progress[selectedSkill.id] || 'not_started'}
          onClose={() => setSelectedSkill(null)}
          onUpdateStatus={() => handleUpdateStatus(selectedSkill)}
        />
      )}
    </>
  );
}
