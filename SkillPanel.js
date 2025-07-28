import React from 'react';
import { motion } from 'framer-motion';

/**
 * The SkillPanel shows detailed information for a selected skill.  It
 * animates open and closed using Framer Motion.  Users can change
 * the status of a skill via buttons which trigger the provided callback.
 */
export default function SkillPanel({ skill, status, onClose, onStatusChange }) {
  const handleMarkInProgress = () => {
    onStatusChange(skill.id, 'in-progress');
  };
  const handleMarkCompleted = () => {
    onStatusChange(skill.id, 'completed');
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 bottom-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200 z-50 max-h-96 overflow-auto"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold mb-2">{skill.title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <p className="text-sm mb-4 whitespace-pre-line">{skill.description}</p>
      {skill.prerequisites && skill.prerequisites.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium">Prerequisites</h3>
          <ul className="list-disc list-inside text-sm">
            {skill.prerequisites.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
      {skill.resources && skill.resources.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium">Resources</h3>
          <ul className="list-disc list-inside text-sm">
            {skill.resources.map((res) => (
              <li key={res.url}><a href={res.url} className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">{res.title}</a></li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-2">
        {status !== 'in-progress' && status !== 'completed' && (
          <button onClick={handleMarkInProgress} className="bg-secondary text-white px-4 py-2 rounded">Mark In‑Progress</button>
        )}
        {status !== 'completed' && (
          <button onClick={handleMarkCompleted} className="bg-primary text-white px-4 py-2 rounded">Mark Completed</button>
        )}
      </div>
    </motion.div>
  );
}