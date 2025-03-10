require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const crypto = require('crypto');
const { Connection, clusterApiUrl, Keypair } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const pinataSDK = require('@pinata/sdk');
const QRCode = require('qrcode');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(fileUpload());

const connection = new Connection(clusterApiUrl('devnet'));
const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOLANA_WALLET_SECRET)));
console.log(`Гаманець SOL: ${wallet.publicKey.toBase58()}`);
const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

// Хешуємо файл SHA-256
const generateHash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

// Завантаження файлу на IPFS
const uploadToIPFS = async (buffer, filename) => {
    const readableStream = require('stream').Readable.from(buffer);
    const options = {
        pinataMetadata: { name: filename },
        pinataOptions: { cidVersion: 1 }
    };
    console.log('Завантаження на IPFS...');
    const result = await pinata.pinFileToIPFS(readableStream, options);
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
};

// Мінтинг NFT
const mintNFT = async (metadataUri, hash, doctorPubKey) => {
    console.log(`Мінтинг NFT...`);
    console.log(`Метадані: ${metadataUri}`);
    console.log(`Хеш файлу: ${hash}`);
    console.log(`Публічний ключ лікаря: ${doctorPubKey}`);
    console.log(`Перевірка балансу SOL перед мінтингом...`);
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`💰 Баланс гаманця перед мінтингом: ${balance / 1e9} SOL`);
    if (balance < 0.0001 * 1e9) {
        throw new Error('Недостатньо SOL для транзакції');
    }
    const mintAccount = Keypair.generate();
    console.log(`Створено мінт акаунт: ${mintAccount.publicKey.toBase58()}`);

    const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: 'MEDNFT',
        symbol: 'MEDNFT',
        sellerFeeBasisPoints: 0,
        creators: [{ address: wallet.publicKey, share: 100 }],
        mintAuthority: wallet,
        updateAuthority: wallet,
        payer: wallet,
    });

    console.log(`✅ NFT успішно створено: ${nft.address.toBase58()}`);
    return nft.address.toBase58();
};

// Генерація QR-коду
const generateQRCode = async (nftAddress) => {
    const url = `https://explorer.solana.com/address/${nftAddress}?cluster=devnet`;
    return await QRCode.toDataURL(url);
};

// Основний ендпоінт для створення NFT-довідки
app.post('/create-nft', async (req, res) => {
    console.log('POST /create-nft - Запит отримано');
    try {
        if (!req.files || !req.files.document) return res.status(400).json({ error: 'Файл не завантажено' });

        const file = req.files.document;
        console.log(`Файл отримано: ${file.name}, розмір: ${file.size} байт`);
        const fileBuffer = file.data;
        const fileHash = generateHash(fileBuffer);
        console.log(`Хеш файлу: ${fileHash}`);
        const ipfsUri = await uploadToIPFS(fileBuffer, file.name);
        console.log(`Файл завантажено в IPFS: ${ipfsUri}`);

        const metadata = {
            name: 'Медична довідка',
            description: 'Це NFT підтверджує справжність медичного документа.',
            image: ipfsUri,
            attributes: [
                { trait_type: 'Hash', value: fileHash },
                { trait_type: 'Doctor', value: req.body.doctorPubKey },
            ],
        };

        const metadataPath = `metadata_${Date.now()}.json`;
        fs.writeFileSync(metadataPath, JSON.stringify(metadata));
        const metadataUri = await uploadToIPFS(fs.readFileSync(metadataPath), metadataPath);

        const nftAddress = await mintNFT(metadataUri, fileHash, req.body.doctorPubKey);
        console.log(`NFT створено: ${nftAddress}`);
        const qrCode = await generateQRCode(nftAddress);

        res.json({ nftAddress, qrCode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка під час створення NFT' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
