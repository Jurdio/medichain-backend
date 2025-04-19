
// solana/web3.js
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
} = require('@solana/web3.js');

// metaplex/js
const {
    Metaplex,
    keypairIdentity,
} = require('@metaplex-foundation/js');
const crypto = require('crypto');
const MintDraft = require('./../models/MintDraft');
const smsService = require('./../services/smsService')

const connection = new Connection(clusterApiUrl('devnet'));
const secret = JSON.parse(process.env.SOLANA_WALLET_SECRET);
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));


exports.mint = async function (req, res) {
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
};

exports.draft = async function (req, res) {
    try {
        const { publicKey, phone, type, metadataHash } = req.body;

        if (!publicKey || !phone || !metadataHash) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const draftId = crypto.randomUUID()
        const draftUrl = `${process.env.SERVER_ADDRESS}/mint/checkout/${draftId}`;

        // 1. Зберігаємо у БД
        await MintDraft.create({
            id: draftId,
            publicKey,
            phone,
            type,
            metadataHash,
            status: 'pending',
            createdAt: new Date(),
        });

        // 2. Відправляємо SMS
        await smsService.sendSMS({
            to: phone,
            message: `To confirm your certificate, please complete payment: ${draftUrl}`,
        });

        // 3. Успіх
        res.json({
            status: 'success',
            draftId,
            checkoutUrl: draftUrl,
        });
    } catch (err) {
        console.error('Draft creation error:', err);
        res.status(500).json({ error: 'Failed to create draft' });
    }
};
