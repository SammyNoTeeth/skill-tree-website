const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance. When running on Vercel, the
// DATABASE_URL environment variable should be provided in the
// connection string format understood by pg. For local development
// you can set this in a .env file.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
});

// Define Skill model
const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  tooltip: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  prerequisites: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: true,
  },
  resources: {
    // store as JSON array of objects {title, url}
    type: DataTypes.JSONB,
    allowNull: true,
  },
  kill_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

// Define User model
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  oauth_provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  oauth_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define UserSkillProgress model
const UserSkillProgress = sequelize.define('UserSkillProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('locked', 'in-progress', 'completed'),
    allowNull: false,
    defaultValue: 'locked',
  },
  notes: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

// Set up associations
User.hasMany(UserSkillProgress, { foreignKey: 'user_id' });
Skill.hasMany(UserSkillProgress, { foreignKey: 'skill_id' });
UserSkillProgress.belongsTo(User, { foreignKey: 'user_id' });
UserSkillProgress.belongsTo(Skill, { foreignKey: 'skill_id' });

module.exports = {
  sequelize,
  Skill,
  User,
  UserSkillProgress,
};
