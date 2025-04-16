const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');

exports.uploadFile = async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File is missing' });
        }

        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);

        const imageRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
            maxBodyLength: Infinity,
            headers: {
                ...form.getHeaders(),
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
            },
        });

        res.json({
            status: 'success',
            ipfs_hash: imageRes.data.IpfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${imageRes.data.IpfsHash}`
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Image upload failed' });
    }
};

exports.uploadMetadata = async function (req, res) {
    try {
        // req.body уже містить JSON‑об’єкт, бо app.use(express.json()) увімкнено
        const metadata = req.body;

        const pinataRes = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            metadata,
            {
                headers: {
                    'Content-Type': 'application/json',
                    pinata_api_key: process.env.PINATA_API_KEY,
                    pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
                },
            },
        );

        res.json({
            status: 'success',
            ipfs_hash: pinataRes.data.IpfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${pinataRes.data.IpfsHash}`,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Metadata upload failed' });
    }
}
