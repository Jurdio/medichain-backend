# 🧬 MediChain Backend

**MediChain Backend** is the core API service that powers the MediCert ecosystem — enabling doctors to securely issue, verify, and mint NFT-based medical certificates.

This backend handles certificate creation, metadata storage, PDF hashing, user authentication (WIP), and blockchain minting operations.

---

## 🔗 Related Repositories

Part of the **MediCert** ecosystem:

- [🔧 medicert-admin](https://github.com/Jurdio/medicert-admin.git) — Doctor-facing frontend panel
- [🧪 medicert-payment]() — Payment logic & smart contracts for NFT minting and certificate validation.

> More tools and SDKs coming soon!

---
## 🚀 Features

- 📄 Create and manage medical certificates
- 🔐 Hash PDF documents to ensure data integrity
- 🧾 Store certificate metadata securely
- ⛓️ Mint certificates as NFTs on Solana
- 🧪 Verify authenticity by hash or ID
- 📂 RESTful API with clear route structure

---

## ⚙️ Tech Stack

- **Node.js** + **Express**
- **MongoDB** for certificate & metadata storage
- **Solana Web3 SDK** for NFT minting
- **PDFKit** + hashing (SHA-256)
- Optional file storage via IPFS (planned)

---

## 📦 Getting Started

```bash
git clone https://github.com/Jurdio/medichain-backend.git
cd medichain-backend
npm install
npm run dev
```
---

## 🔐 Environment Configuration
Create a .env file with the following keys:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/medichain
JWT_SECRET=supersecurestring
SOLANA_PRIVATE_KEY=...
```
---
## 📘 API Routes
POST   /v1/drafts           # Create draft certificate
GET    /v1/drafts           # Get paginated list
POST   /v1/verify           # Verify by hash
POST   /v1/mint             # Mint NFT certificate
More endpoints documented via Swagger coming soon.
---
## 📂 Folder Structure
```
src/
├── controllers/
├── routes/
├── models/
├── services/
└── utils/
```
---
## 🧠 Related Projects
🩺 medicert-admin – Doctor-facing frontend panel

📱 medicert-app – Mobile companion app
---
## 🧑‍💻 Author
Built with ❤️ by @Jurdio
---
## 📜 License
MIT — use, modify, contribute.
