const express = require('express');
const router = express.Router();

let Skill;
try {
  const models = require('../models');
  Skill = models.Skill;
} catch (err) {
  console.warn('Skills model not available:', err.message);
}

// GET /api/skills
router.get('/', async (req, res) => {
  // Return empty array if Skill model is not available (e.g., during preview builds)
  if (!Skill) {
    return res.json([]);
  }
  try {
    const skills = await Skill.findAll({ order: [['skill_order', 'ASC']] });
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

module.exports = router;
