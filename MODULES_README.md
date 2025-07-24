# MediChain Backend Modules

Цей документ описує нові модулі, створені для системи авторизації через крипто гаманець та генерації NFT сертифікатів у Solana.

## Структура модулів

### 1. Users Module (`src/users/`)

Модуль для управління користувачами системи.

#### Компоненти:
- **User Entity** (`entities/user.entity.ts`) - Модель користувача з профілем та крипто гаманцем
- **Users Service** (`users.service.ts`) - Бізнес-логіка управління користувачами
- **Users Controller** (`users.controller.ts`) - API ендпоінти для користувачів
- **DTOs** (`dto/`) - Об'єкти передачі даних

#### Основні функції:
- Створення нового користувача
- Оновлення профілю користувача
- Генерація nonce для авторизації
- Верифікація користувача
- Отримання інформації про користувача

#### API Ендпоінти:
```
POST /users - Створити користувача
GET /users/:id - Отримати користувача за ID
PATCH /users/:id - Оновити користувача
DELETE /users/:id - Видалити користувача (захист)
GET /users/admin/test - Smoke test
```

### 2. Crypto Auth Module (`src/crypto-auth/`)

Модуль для авторизації через крипто гаманець з використанням підпису повідомлень.

#### Компоненти:
- **Crypto Auth Service** (`crypto-auth.service.ts`) - Логіка авторизації
- **Crypto Auth Controller** (`crypto-auth.controller.ts`) - API ендпоінти авторизації
- **DTOs** (`dto/`) - Об'єкти для авторизації

#### Основні функції:
- Запит повідомлення для підпису
- Верифікація підпису повідомлення
- Генерація JWT токенів
- Автоматичне створення користувача при першій авторизації

#### API Ендпоінти:
```
POST /crypto-auth/request - Запит повідомлення для підпису
POST /crypto-auth/verify - Верифікація підпису та авторизація
POST /crypto-auth/admin/test - Smoke test
```

#### Процес авторизації:
1. Клієнт відправляє wallet address
2. Сервер генерує унікальне повідомлення з nonce
3. Клієнт підписує повідомлення своїм приватним ключем
4. Сервер верифікує підпис та видає JWT токен

### 3. NFT Generation Module (`src/nft-generation/`)

Модуль для створення та управління NFT сертифікатами в Solana.

#### Компоненти:
- **NFT Generation Service** (`nft-generation.service.ts`) - Логіка створення NFT
- **NFT Generation Controller** (`nft-generation.controller.ts`) - API ендпоінти
- **DTOs** (`dto/`) - Об'єкти для NFT операцій

#### Основні функції:
- Створення NFT сертифікатів
- Завантаження метаданих в IPFS
- Мінтінг NFT в Solana
- Верифікація власності NFT
- Отримання NFT користувача

#### API Ендпоінти:
```
POST /nft-generation - Створити NFT сертифікат
GET /nft-generation/:id - Отримати NFT за ID
GET /nft-generation/user/:walletAddress - Отримати NFT користувача
GET /nft-generation/verify/:nftMintAddress/:walletAddress - Верифікувати власність
GET /nft-generation/admin/test - Smoke test
```

### 4. Shared Module (`src/shared/`)

Модуль з спільними сервісами для всіх модулів.

#### Компоненти:
- **Pinata Service** (`pinata.service.ts`) - Робота з IPFS через Pinata
- **Shared Module** (`shared.module.ts`) - Експорт спільних сервісів

#### Основні функції:
- Завантаження метаданих в IPFS
- Завантаження файлів в IPFS
- Отримання URL метаданих

## Технології та залежності

### Криптографія:
- **tweetnacl** - Для верифікації підписів Ed25519
- **bs58** - Для кодування/декодування Base58

### Blockchain:
- **@solana/web3.js** - Solana Web3 API
- **@metaplex-foundation/js** - Metaplex для NFT операцій

### IPFS:
- **@pinata/sdk** - Pinata SDK для завантаження в IPFS

### Авторизація:
- **@nestjs/jwt** - JWT токени
- **@nestjs/passport** - Passport стратегії

## Конфігурація

### Environment Variables:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=medichain

# JWT
JWT_SECRET=your-secret-key

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your-private-key

# Pinata (IPFS)
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
```

## Тестування

### Unit Tests:
- `src/users/users.service.spec.ts` - Тести сервісу користувачів
- `src/users/users.controller.spec.ts` - Тести контролера користувачів

### Smoke Tests:
Кожен модуль має smoke test ендпоінт для перевірки роботи:
- `GET /users/admin/test`
- `POST /crypto-auth/admin/test`
- `GET /nft-generation/admin/test`

## Безпека

### Авторизація:
- Верифікація підпису Ed25519
- Унікальні nonce для кожного запиту
- JWT токени з терміном дії 24 години

### Валідація:
- Class-validator для валідації DTO
- Перевірка існування користувачів
- Верифікація власності NFT

### База даних:
- Унікальні індекси для wallet addresses
- Зв'язки між користувачами та сертифікатами
- Типізація через TypeORM

## Використання

### 1. Створення користувача:
```typescript
const user = await usersService.createUser({
  walletAddress: 'user-wallet-address',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});
```

### 2. Авторизація через крипто гаманець:
```typescript
// Запит повідомлення
const authRequest = await cryptoAuthService.requestAuth({
  walletAddress: 'user-wallet-address'
});

// Підпис повідомлення клієнтом
const signature = await wallet.signMessage(authRequest.message);

// Верифікація підпису
const authResponse = await cryptoAuthService.verifyAuth({
  walletAddress: 'user-wallet-address',
  message: authRequest.message,
  signature: signature
});
```

### 3. Створення NFT сертифіката:
```typescript
const nft = await nftGenerationService.createNft({
  patientWalletAddress: 'patient-wallet',
  doctorWalletAddress: 'doctor-wallet',
  certificateType: CertificateType.VACCINATION,
  title: 'COVID-19 Vaccination Certificate',
  description: 'Certificate of COVID-19 vaccination',
  issueDate: '2024-01-15',
  imageUrl: 'https://example.com/certificate.png'
});
```

## Розвиток

### Плани на майбутнє:
1. Додавання різних типів сертифікатів
2. Інтеграція з іншими блокчейнами
3. Система ролей та дозволів
4. Аудит логування
5. Кешування для покращення продуктивності
6. WebSocket для real-time оновлень 