const express = require('express');
const router = express.Router();
const { getHistory, deleteHistory, exportHistory } = require('../controllers/history.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Your auth middleware

router.get('/', authMiddleware, getHistory);
router.delete('/', authMiddleware, deleteHistory);
router.post('/export', authMiddleware, exportHistory);

module.exports = router;