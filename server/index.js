import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializePool, closePool } from './db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

let dbInitialized = false;

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: dbInitialized ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'home.html'));
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

const start = async () => {
  try {
    await initializePool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'game_db',
    });
    dbInitialized = true;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Available endpoints:');
      console.log('  POST   /api/auth/signup');
      console.log('  POST   /api/auth/login');
      console.log('  GET    /api/events');
      console.log('  GET    /api/songs');
      console.log('  GET    /api/gamecenters');
      console.log('  GET    /api/search/songs?q={query}');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await closePool();
  process.exit(0);
});

start();
