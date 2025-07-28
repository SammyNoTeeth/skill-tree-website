const express = require('express');
const router = express.Router();
const { User, Skill, UserSkillProgress } = require('../models');

// Middleware to ensure the requesting user matches the path param.
function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
}

// GET /api/users/:id/progress
router.get('/:id/progress', ensureAuthenticated, async (req, res) => {
  // Only allow a user to fetch their own progress
  if (req.user.user_id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const progresses = await UserSkillProgress.findAll({ where: { user_id: req.params.id } });
    const result = {};
    progresses.forEach((p) => {
      result[p.skill_id] = p.status;
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/users/:id/progress
router.post('/:id/progress', ensureAuthenticated, async (req, res) => {
  if (req.user.user_id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { skillId, status, notes } = req.body;
  if (!skillId || !status) {
    return res.status(400).json({ error: 'skillId and status are required' });
  }
  try {
    // verify skill exists
    const skill = await Skill.findByPk(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    // upsert the progress record
    const [record, created] = await UserSkillProgress.findOrCreate({
      where: { user_id: req.params.id, skill_id: skillId },
      defaults: { status, notes },
    });
    if (!created) {
      // update existing record
      record.status = status;
      if (notes) record.notes = notes;
      record.last_updated = new Date();
      await record.save();
    }
    res.json({ id: record.id, skill_id: record.skill_id, status: record.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
