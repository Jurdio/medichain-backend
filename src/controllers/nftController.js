
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
