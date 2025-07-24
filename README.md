# MediChain Backend

Backend для додатку медичних сертифікатів з авторизацією через криптогаманець, мінтингом NFT на Solana та їх перевіркою.

## Функціональність

- 🔐 Авторизація через криптогаманець (Solana)
- 🏥 Створення та управління медичними сертифікатами
- 🎨 Мінтинг NFT сертифікатів на Solana
- ✅ Перевірка автентичності сертифікатів
- 📊 API документація з Swagger

## Технології

- **Framework**: NestJS
- **Database**: PostgreSQL з TypeORM
- **Blockchain**: Solana (devnet/testnet)
- **NFT**: Metaplex
- **Authentication**: JWT + Wallet signature
- **Documentation**: Swagger/OpenAPI

## Встановлення

1. Клонуйте репозиторій:
```bash
git clone <repository-url>
cd medichain-backend
```

2. Встановіть залежності:
```bash
npm install
```

3. Налаштуйте змінні середовища:
```bash
cp env.example .env
```

4. Відредагуйте `.env` файл з вашими налаштуваннями:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_NAME=medichain

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your-solana-private-key-base58-encoded
```

5. Створіть базу даних PostgreSQL:
```sql
CREATE DATABASE medichain;
```

6. Запустіть додаток:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Авторизація
- `POST /auth/wallet` - Авторизація через криптогаманець
- `GET /auth/profile` - Отримання профілю користувача

### Сертифікати
- `POST /certificates` - Створення сертифікату
- `POST /certificates/:id/mint` - Мінтинг NFT для сертифікату
- `GET /certificates/:id` - Отримання сертифікату за ID
- `GET /certificates/patient/:patientId` - Сертифікати пацієнта
- `GET /certificates/doctor/:doctorId` - Сертифікати лікаря
- `GET /certificates/:id/verify` - Перевірка сертифікату
- `GET /certificates/:id/nft-metadata` - Метадані NFT

## Використання

### 1. Авторизація через криптогаманець

```javascript
// Підпис повідомлення гаманцем
const message = "Authenticate with MediChain: " + Date.now();
const signature = await wallet.signMessage(new TextEncoder().encode(message));

// Відправка запиту
const response = await fetch('/auth/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicKey: wallet.publicKey.toString(),
    signature: bs58.encode(signature),
    message: message
  })
});
```

### 2. Створення сертифікату

```javascript
const certificate = await fetch('/certificates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    patientId: "patient-uuid",
    certificateType: "vaccination",
    issueDate: "2024-01-15",
    title: "COVID-19 Vaccination",
    description: "First dose of COVID-19 vaccine",
    attributes: [
      { trait_type: "Vaccine", value: "Pfizer-BioNTech" },
      { trait_type: "Dose", value: 1 }
    ]
  })
});
```

### 3. Мінтинг NFT

```javascript
const nft = await fetch(`/certificates/${certificateId}/mint`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token }
});
```

### 4. Перевірка сертифікату

```javascript
const verification = await fetch(`/certificates/${certificateId}/verify?publicKey=${publicKey}`);
const { isValid } = await verification.json();
```

## Розробка

### Структура проекту

```
src/
├── common/
│   ├── entities/          # Сутності бази даних
│   └── types/             # Загальні типи
├── modules/
│   ├── auth/              # Модуль авторизації
│   ├── certificates/      # Модуль сертифікатів
│   └── solana/            # Модуль Solana
├── app.module.ts          # Головний модуль
└── main.ts               # Точка входу
```

### Команди

```bash
# Розробка
npm run start:dev

# Тестування
npm run test
npm run test:e2e

# Лінтінг
npm run lint

# Форматування
npm run format

# Збірка
npm run build
```

## Безпека

- Всі приватні ключі зберігаються в змінних середовища
- JWT токени мають обмежений термін дії
- Перевірка підпису гаманця для авторизації
- Валідація всіх вхідних даних

## Ліцензія

MIT
