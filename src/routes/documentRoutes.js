const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.post('/', documentController.createDocument);

router.get('/', documentController.getDocuments);

module.exports = router;
