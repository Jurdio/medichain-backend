// express app to issue and fetch NFT medical certificates
import express from 'express';
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const connection = new Connection(clusterApiUrl('devnet'));

const secret = JSON.parse(process.env.SOLANA_WALLET_SECRET);
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));

// POST /nft/issue
app.post('/nft/issue', async (req, res) => {
    try {
        const { wallet: walletAddress, certificate } = req.body;

        // ручна підготовка метаданих — завантажити на ipfs самостійно через nft.storage
        const uri = certificate.uri; // передаємо готовий IPFS URI в тілі

        const { nft, response } = await metaplex.nfts().create({
            uri,
            name: certificate.name,
            sellerFeeBasisPoints: 0,
            tokenOwner: new PublicKey(walletAddress),
        });

        res.json({ status: 'success', mint: nft.address.toBase58(), transaction_url: `https://solscan.io/tx/${response.signature}?cluster=devnet` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to issue certificate' });
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
