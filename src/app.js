const express = require('express');
const cors = require('cors');

// Import routers
const authRoutes = require('./routes/authRoutes');
const songsRoutes = require('./routes/songsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const listsRoutes = require('./routes/listsRoutes');
const usersRoutes = require('./routes/usersRoutes');


const app = express();

app.use(cors());
app.use(express.json());

// API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Server is running" });
});

module.exports = app;