require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

let sequelize = null;
let User = null;
let SequelizeStore = null;

try {
  const models = require('./models');
  sequelize = models.sequelize;
  User = models.User;
  SequelizeStore = require('connect-session-sequelize')(session.Store);
} catch (err) {
  console.warn('Database models could not be loaded:', err.message);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));

if (sequelize && SequelizeStore) {
  const store = new SequelizeStore({ db: sequelize });
  app.use(session({
    secret: process.env.SESSION_SECRET || 'temporarySecret',
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  }));
  store.sync();
} else {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'temporarySecret',
    resave: false,
    saveUninitialized: true
  }));
}

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user && user.id ? user.id : null);
});

passport.deserializeUser(async (id, done) => {
  if (User) {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  } else {
    done(null, null);
  }
});

// OAuth strategies
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    if (!User) return done(null, profile);
    try {
      let user = await User.findOne({ where: { googleId: profile.id } });
      if (!user) {
        user = await User.create({ googleId: profile.id, username: profile.displayName });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
} else {
  console.warn('Google OAuth credentials missing, Google login disabled.');
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    if (!User) return done(null, profile);
    try {
      let user = await User.findOne({ where: { githubId: profile.id } });
      if (!user) {
        user = await User.create({ githubId: profile.id, username: profile.username });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
} else {
  console.warn('GitHub OAuth credentials missing, GitHub login disabled.');
}
//
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile'] }));
  app.get('/api/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: process.env.CLIENT_URL || '/'
  }));
} else {
  app.get('/api/auth/google', (req, res) => {
    res.status(503).json({ error: 'OAuth login temporarily unavailable due to missing credentials' });
  });
  app.get('/api/auth/google/callback', (req, res) => {
    res.status(503).json({ error: 'OAuth login temporarily unavailable due to missing credentials' });
  });
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  app.get('/api/auth/github', passport.authenticate('github'));
  app.get('/api/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: process.env.CLIENT_URL || '/'
  }));
} else {
  app.get('/api/auth/github', (req, res) => {
    res.status(503).json({ error: 'OAuth login temporarily unavailable due to missing credentials' });
  });
  app.get('/api/auth/github/callback', (req, res) => {
    res.status(503).json({ error: 'OAuth login temporarily unavailable due to missing credentials' });
  });
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend API active' });
});

// Attach individual user and skill routes
try {
  const usersRouter = require('./routes/users');
  app.use('/api/users', usersRouter);
} catch (err) {
  console.warn('Users routes could not be loaded:', err.message);
}

try {
  const skillsRouter = require('./routes/skills');
  app.use('/api/skills', skillsRouter);
} catch (err) {
  console.warn('Skills routes could not be loaded:', err.message);
}

// Sync database if available
if (sequelize) {
  sequelize.sync().catch(err => {
    console.warn('Database sync failed:', err.message);
  });
}

module.exports = app;
