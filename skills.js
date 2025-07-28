const express = require('express');
const router = express.Router();
const { Skill } = require('../models');

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.findAll({ order: [['skill_order', 'ASC']] });
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

module.exports = router;