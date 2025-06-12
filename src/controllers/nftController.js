const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
} = require('@solana/web3.js');

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

        await MintDraft.create({
            id: draftId,
            publicKey,
            phone,
            type,
            metadataHash,
            status: 'pending',
            createdAt: new Date(),
        });

        await smsService.sendSMS({
            to: phone,
            message: `To confirm your certificate, please complete payment: ${draftUrl}`,
        });

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

exports.getDraftById = async function (req, res) {
    try {
        const { draftId } = req.params;

        if (!draftId) {
            return res.status(400).json({ error: 'Missing draft ID' });
        }

        const draft = await MintDraft.findById(draftId);

        if (!draft) {
            return res.status(404).json({ error: 'Draft not found' });
        }

        res.json({
            status: 'success',
            draft: {
                id: draft.id,
                phone: draft.phone,
                publicKey: draft.publicKey,
                type: draft.type,
                metadataHash: draft.metadataHash,
                status: draft.status,
                paidAt: draft.paidAt,
                createdAt: draft.createdAt,
            }
        });
    } catch (err) {
        console.error('Error fetching draft by ID:', err);
        res.status(500).json({ error: 'Failed to fetch draft' });
    }
};

exports.getDraftHistory = async function (req, res) {
    try {
        const {
            phone,
            type,
            status,
            createdFrom,
            createdTo,
            page = 1,
            limit = 20
        } = req.query;

        const query = {};

        if (phone) query.phone = phone;
        if (type) query.type = type;
        if (status) query.status = status;

        if (createdFrom || createdTo) {
            query.createdAt = {};
            if (createdFrom) query.createdAt[Op.gte] = new Date(createdFrom);
            if (createdTo) query.createdAt[Op.lte] = new Date(createdTo);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await MintDraft.count({ where: query });

        const drafts = await MintDraft.findAll({
            where: query,
            order: [['createdAt', 'DESC']],
            offset: skip,
            limit: parseInt(limit),
        });

        res.status(200).json({
            status: 'success',
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            },
            data: drafts.map(draft => ({
                id: draft.id,
                phone: draft.phone,
                publicKey: draft.publicKey,
                type: draft.type,
                metadataHash: draft.metadataHash,
                status: draft.status,
                paidAt: draft.paidAt,
                createdAt: draft.createdAt,
            }))
        });
    } catch (err) {
        console.error('Error fetching drafts:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch drafts' });
    }
};

