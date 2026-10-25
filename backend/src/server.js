require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React frontend to call this API.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

// Health check endpoint - useful for load balancers and CI smoke tests.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api', apiRoutes);

// Central error handler.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 fallback.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
