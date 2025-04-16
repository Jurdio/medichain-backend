const express = require('express');
const ipfsController = require('../controllers/ipfsController');
const router = express.Router();
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),      // файл тримається в пам'яті
    limits: { fileSize: 10 * 1024 * 1024 } // 10 МБ ліміт (за потреби)
}).single('file');

router.post('/v1/ipfs/files', upload, ipfsController.uploadFile);
router.post('/v1/ipfs/metadata', ipfsController.uploadMetadata);

module.exports = router;
