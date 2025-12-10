import express from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get(
  '/events',
  asyncHandler(async (req, res) => {
    const events = await query(
      'SELECT * FROM events ORDER BY event_start_date DESC LIMIT 20'
    );

    res.json({
      success: true,
      data: events,
    });
  })
);

router.get(
  '/songs',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const songs = await query(
      `SELECT
        song_id,
        song_name,
        artist_name,
        pattern_difficulty,
        pattern_lv,
        players_best_score,
        player_name,
        clear_type,
        song_jacket_url,
        dlc_required_name,
        clear_video_link
      FROM songs
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) as total FROM songs');
    const total = countResult[0].total;

    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

router.get(
  '/gamecenters',
  asyncHandler(async (req, res) => {
    const gamecenters = await query(
      `SELECT
        gamecenter_id,
        gamecenter_name,
        gamecenter_locate,
        distance_km
      FROM game_centers
      ORDER BY distance_km ASC`
    );

    res.json({
      success: true,
      data: gamecenters,
    });
  })
);

router.get(
  '/dlc',
  asyncHandler(async (req, res) => {
    const dlcItems = await query(
      `SELECT
        song_id as id,
        song_name as title,
        'S+' as rank,
        CONCAT(players_best_score) as score,
        dlc_required_name as dlc
      FROM songs
      WHERE dlc_required_name IS NOT NULL
      ORDER BY players_best_score DESC
      LIMIT 20`
    );

    res.json(dlcItems);
  })
);

router.get(
  '/search/songs',
  asyncHandler(async (req, res) => {
    const searchQuery = req.query.q;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const results = await query(
      `SELECT
        song_id,
        song_name,
        artist_name,
        pattern_difficulty,
        pattern_lv,
        players_best_score,
        player_name,
        clear_type,
        song_jacket_url,
        dlc_required_name,
        clear_video_link
      FROM songs
      WHERE song_name LIKE ? OR artist_name LIKE ? OR dlc_required_name LIKE ?
      LIMIT 20`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    res.json({
      success: true,
      data: results,
      query: searchQuery,
    });
  })
);

export default router;
