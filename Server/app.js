require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const circleRoutes = require('./routes/circleRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const messageRoutes = require('./routes/messageRoutes'); // ← חדש

const app = express();

// crossOriginResourcePolicy: מאפשר לתמונות ולקבצים מ-/uploads להיטען
// מהאתר (frontend) גם כשהוא רץ על כתובת/פורט אחר מהשרת עצמו
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({ 
  origin: process.env.CLIENT_URL, 
  credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { 
    success: false, 
    message: 'יותר מדי בקשות, נסה שוב בעוד 15 דקות' 
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { 
    success: false, 
    message: 'יותר מדי ניסיונות התחברות, נסה שוב בעוד 15 דקות' 
  }
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes); // ← חדש

// Error Handler — חייב להיות אחרון!
app.use(errorHandler);

module.exports = app;