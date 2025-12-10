import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { id, password, username } = req.body;

    if (!id || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'ID, password, and username are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await query('SELECT * FROM user WHERE id = ?', [id]);

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'ID already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query('INSERT INTO user (id, pw, username) VALUES (?, ?, ?)', [
      id,
      hashedPassword,
      username,
    ]);

    const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: 'ID and password are required',
      });
    }

    const users = await query('SELECT * FROM user WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.pw);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  })
);

export default router;
