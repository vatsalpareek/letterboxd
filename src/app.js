const express = require('express');
const cors = require('cors');
// Import the router just created
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
// tell express that any url starting with /api/auth should use our router
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Server is running" });
});

module.exports = app;