// express app to upload files to Pinata and mint NFT medical certificates
import express from 'express';
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
dotenv.config();

const app = express();
app.use(express.json());

const connection = new Connection(clusterApiUrl('devnet'));
const secret = JSON.parse(process.env.SOLANA_WALLET_SECRET);
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));

const upload = multer({ dest: 'uploads/' });

// POST /pinata/upload-image
app.post('/pinata/upload-image', upload.single('image'), async (req, res) => {
    try {
        const imageForm = new FormData();
        imageForm.append('file', fs.createReadStream(req.file.path));

        const imageRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imageForm, {
            maxBodyLength: Infinity,
            headers: {
                ...imageForm.getHeaders(),
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
});

// POST /pinata/upload-metadata
app.post('/pinata/upload-metadata', upload.single('metadata'), async (req, res) => {
    try {
        const rawMeta = JSON.parse(fs.readFileSync(req.file.path));

        const metaForm = new FormData();
        metaForm.append('file', Buffer.from(JSON.stringify(rawMeta)), { filename: 'metadata.json' });

        const metaRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', metaForm, {
            maxBodyLength: Infinity,
            headers: {
                ...metaForm.getHeaders(),
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
            },
        });

        res.json({
            status: 'success',
            ipfs_hash: metaRes.data.IpfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${metaRes.data.IpfsHash}`
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Metadata upload failed' });
    }
});

// POST /pinata/upload-metadata-json
app.post('/pinata/upload-metadata-json', async (req, res) => {
    try {
        // req.body уже містить JSON‑об’єкт, бо app.use(express.json()) увімкнено
        const metadata = req.body;          // 👉 ваше тіло запиту

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
});


// POST /nft/issue
app.post('/nft/issue', async (req, res) => {
    try {
        const { wallet: walletAddress, uri, name } = req.body;

        const { nft, response } = await metaplex.nfts().create({
            uri,
            name,
            sellerFeeBasisPoints: 0,
            tokenOwner: new PublicKey(walletAddress),
        });

        res.json({
            status: 'success',
            mint: nft.address.toBase58(),
            transaction_url: `https://solscan.io/tx/${response.signature}?cluster=devnet`,
            metadata_url: uri
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to mint NFT' });
    }
});

// GET /nft/certificates/:pubkey
app.get('/nft/certificates/:pubkey', async (req, res) => {
    try {
        const pubkey = new PublicKey(req.params.pubkey);
        const nfts = await metaplex.nfts().findAllByOwner({ owner: pubkey });

        const medicalNfts = (await Promise.all(nfts.map(async (nft) => {
            try {
                const full = await metaplex.nfts().load({ metadata: nft });
                const isMedical = full.json?.attributes?.some(a => a.trait_type === 'Type' && a.value === 'medical_certificate');
                if (!isMedical) return null;
                return {
                    mint: full.address.toBase58(),
                    name: full.name,
                    image: full.json?.image,
                    ...Object.fromEntries(full.json?.attributes.map(a => [a.trait_type.toLowerCase().replace(/ /g, '_'), a.value]))
                };
            } catch (err) {
                return null;
            }
        }))).filter(Boolean);

        res.json(medicalNfts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch certificates' });
    }
});

app.listen(3000, () => {
    console.log('Medical NFT API running on port 3000');
});
