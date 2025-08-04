const express = require('express');
const cors = require('cors');

let sequelize = null;
let User = null;
let Skill = null;

try {
  const models = require('./models');
  sequelize = models.sequelize;
  User = models.User;
  Skill = models.Skill;
} catch (err) {
  console.warn('Database models could not be loaded:', err.message);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend API active' });
});

// Skills route - returns skills from DB if available or fallback data
app.get('/api/skills', async (req, res) => {
  if (Skill) {
    try {
      const skills = await Skill.findAll();
      return res.json(skills);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    }
  }
  // Fallback static data
  return res.json([
    { id: 1, name: 'JavaScript', description: 'Placeholder skill' },
    { id: 2, name: 'Python', description: 'Placeholder skill' }
  ]);
});

// User progress route - GET
app.get('/api/users/:id/progress', async (req, res) => {
  const userId = req.params.id;
  if (User) {
    try {
      const user = await User.findByPk(userId);
      if (user && user.progress) {
        return res.json(user.progress);
      }
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
    }
  }
  // Fallback progress
  return res.json({ userId, progress: [] });
});

// User progress route - POST
app.post('/api/users/:id/progress', async (req, res) => {
  const userId = req.params.id;
  const progress = req.body;
  if (User) {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ progress });
        return res.json({ message: 'Progress saved' });
      }
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }
  // Echo fallback
  return res.json({ userId, received: progress });
});

// Fallback for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
