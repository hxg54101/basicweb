import express from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get(
  '/events',
  asyncHandler(async (req, res) => {
    const events = await query(
      'SELECT EVENT_TITLE, EVENT_DETAIL, EVENT_START_DATE, EVENT_END_DATE FROM arcade WHERE EVENT_TITLE IS NOT NULL ORDER BY EVENT_START_DATE DESC LIMIT 20'
    );

    res.json({
      success: true,
      data: events,
    });
  })
);

router.get(
  '/patches',
  asyncHandler(async (req, res) => {
    const patches = await query(
      'SELECT PATCH_TITLE, PATCH_DETAIL, PATCH_RELEASE_DATE FROM arcade WHERE PATCH_TITLE IS NOT NULL ORDER BY PATCH_RELEASE_DATE DESC LIMIT 20'
    );

    res.json({
      success: true,
      data: patches,
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
        ranking_id,
        SONG_NAME,
        ARTIST_NAME,
        PATTERN_DIFFICULTY,
        PATTERN_LV,
        BEST_SCORE,
        PLAYER_NAME,
        CLEAR_TYPE
      FROM pc_ranking
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) as total FROM pc_ranking');
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
        arcade_id,
        GAMECENTER_NAME,
        GAMECENTER_LOCATE
      FROM arcade
      WHERE GAMECENTER_NAME IS NOT NULL
      ORDER BY arcade_id ASC`
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
        ranking_id as id,
        SONG_NAME as title,
        'S+' as rank,
        BEST_SCORE as score,
        'DLC Required' as dlc
      FROM pc_ranking
      ORDER BY BEST_SCORE DESC
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
        ranking_id,
        SONG_NAME,
        ARTIST_NAME,
        PATTERN_DIFFICULTY,
        PATTERN_LV,
        BEST_SCORE,
        PLAYER_NAME,
        CLEAR_TYPE
      FROM pc_ranking
      WHERE SONG_NAME LIKE ? OR ARTIST_NAME LIKE ? OR PLAYER_NAME LIKE ?
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
