const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportController');

// POST /api/reports - Save a report
router.post('/', reportController.createReport);

// GET /api/reports - Fetch all reports (with optional userId query)
router.get('/', reportController.getReports);

// GET /api/reports/user/:userId - Fetch reports for specific user
router.get('/user/:userId', reportController.getUserReports);

// GET /api/reports/user/:userId/grouped - Fetch reports grouped by game type
router.get('/user/:userId/grouped', reportController.getUserReportsGrouped);

// GET /api/reports/user/:userId/ptsd-logs - Fetch detailed PTSD game logs for a user
router.get('/user/:userId/ptsd-logs', reportController.getPTSDGameLogs);

// GET /api/reports/test - Test database connection
router.get('/test', reportController.testConnection);

// POST /api/reports/features - Save per-game features/logs
router.post('/features', reportController.saveGameFeature);

module.exports = router;
