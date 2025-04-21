const express = require('express');
const nftController = require('../controllers/nftController');
const router = express.Router();

router.post('/v1/nft/certificates', nftController.mint);
router.post('/v1/nft/draft', nftController.draft);
router.get('/v1/checkout/:draftId', nftController.getDraftById);
router.get('/v1/drafts', nftController.getDraftHistory);


module.exports = router;
