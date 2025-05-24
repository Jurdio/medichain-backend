# 🩺 MediCert Admin

**MediCert Admin** is a web-based admin panel for medical professionals to issue and verify blockchain-protected medical certificates as NFTs. It is part of the MediCert ecosystem — a decentralized medical documentation platform built on trust, transparency, and modern Web3 infrastructure.

---
## 🔗 Related Repositories

Part of the **MediCert** ecosystem:

- [🔧 medicert-admin](https://github.com/Jurdio/medicert-admin.git) — Doctor-facing frontend panel
- [🧪 medicert-payment]() — Payment logic & smart contracts for NFT minting and certificate validation.

> More tools and SDKs coming soon!

---
## 🚀 Features

- 🔒 **Protect Certificate**: Upload medical documents, assign to a wallet, and mint NFTs on the blockchain.
- ✅ **Verify Certificate**: Validate authenticity by certificate hash or ID.
- 🕓 **History View**: Browse the full list of previously issued certificates, including status and metadata.
- 🧾 **PDF Upload Support**: Easy drag-and-drop PDF upload for medical forms.
- 🖥️ **Admin UI**: Intuitive interface built with PrimeVue & Vue 3.

---

## 📸 Screenshots
<img src="./docs/img.png" alt="Protect Certificate" width="100%" />
<img src="./docs/img_1.png" alt="Protect Certificate" width="100%" />
<img src="./docs/img_2.png" alt="Protect Certificate" width="100%" />

---

## 🛠️ Tech Stack

- ⚙️ **Vue 3 + Vite** – Fast modern frontend setup
- 💠 **PrimeVue** – Clean component library
- 🌐 **REST API** – Integration with MediCert backend
- ⛓️ **NFT-ready** – Blockchain-aware UX for certificate minting

---

## 📦 Getting Started

```bash
git clone https://github.com/Jurdio/medicert-admin.git
cd medicert-admin
npm install
npm run dev
```
---
## 🌍 Configuration
Create a .env file in the root directory:
```
VITE_SERVER_ADDRESS=https://your-api-domain.com
```
---
📁 Project Structure
```
src/
├── components/       # Reusable components (Sidebar, Tables, Forms)
├── views/            # Main page views: Protect, Verify, History
├── assets/           # Images, icons
├── router/           # Route definitions
└── main.js           # App entry point
```
---
## 🧠 Roadmap
Authentication & role management

QR-based certificate validation

Metadata preview before minting

Export to PDF/JSON
---
## 🧑‍⚕️ Author
Made with ❤️ by @Jurdio
---
## 📜 License
MIT License – feel free to fork, adapt, or build upon it.

