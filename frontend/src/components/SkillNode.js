import React from 'react';
import { motion } from 'framer-motion';

/**
 * A hexagonal skill node.  The node’s colour reflects its status and
 * it responds to hover and click interactions.  We use CSS clip‑paths
 * to create the hexagon shape and Framer Motion for subtle scaling.
 */
export default function SkillNode({ skill, status, onClick }) {
  // Determine background colour based on state
  let bg;
  let border;
  let icon;
  switch (status) {
    case 'completed':
      bg = 'bg-primary';
      border = 'border-primary';
      icon = '✓';
      break;
    case 'in-progress':
      bg = 'bg-transparent';
      border = 'border-secondary';
      icon = '…';
      break;
    case 'unlocked':
      bg = 'bg-primary/20';
      border = 'border-primary';
      icon = '';
      break;
    default:
      bg = 'bg-gray-200';
      border = 'border-gray-300';
      icon = '';
  }
  return (
    <motion.div
      className={`relative w-32 h-32 cursor-pointer select-none ${bg} ${border} border-2 flex items-center justify-center text-center px-2`}
      style={{ clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)' }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      onClick={onClick}
    >
      <div>
        <p className="font-medium text-sm leading-tight truncate" title={skill.title}>{skill.title}</p>
        {icon && <p className="text-lg mt-1">{icon}</p>}
      </div>
    </motion.div>
  );
}
