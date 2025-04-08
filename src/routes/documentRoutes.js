const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// POST /api/documents - створити документ
router.post('/', documentController.createDocument);

// GET /api/documents?page=1&limit=10&type=passport&userId=123
router.get('/', documentController.getDocuments);

module.exports = router;
