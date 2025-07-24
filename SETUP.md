# Налаштування MediChain Backend

## Крок 1: Підготовка середовища

### Встановлення залежностей
```bash
npm install
```

### Налаштування бази даних PostgreSQL
1. Встановіть PostgreSQL
2. Створіть базу даних:
```sql
CREATE DATABASE medichain;
```

### Налаштування змінних середовища
1. Скопіюйте файл конфігурації:
```bash
cp env.example .env
```

2. Відредагуйте `.env` файл:
```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_NAME=medichain

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your-solana-private-key-base58-encoded
SOLANA_NETWORK=devnet
```

## Крок 2: Налаштування Solana

### Отримання приватного ключа для тестування
1. Встановіть Solana CLI
2. Створіть новий гаманець:
```bash
solana-keygen new --outfile test-wallet.json
```

3. Отримайте приватний ключ у форматі base58:
```bash
solana-keygen pubkey test-wallet.json
```

4. Додайте ключ до `.env` файлу:
```env
SOLANA_PRIVATE_KEY=your-base58-encoded-private-key
```

### Отримання SOL для тестування
```bash
solana airdrop 1 $(solana-keygen pubkey test-wallet.json) --url devnet
```

## Крок 3: Запуск додатку

### Режим розробки
```bash
npm run start:dev
```

### Режим продакшн
```bash
npm run build
npm run start:prod
```

## Крок 4: Тестування API

### Перевірка роботи сервісу
```bash
curl http://localhost:3001/health
```

### Отримання документації API
Відкрийте браузер: http://localhost:3001/api

## Крок 5: Приклади використання

### Авторизація через криптогаманець
```javascript
// На фронтенді
const message = "Authenticate with MediChain: " + Date.now();
const signature = await wallet.signMessage(new TextEncoder().encode(message));

const response = await fetch('/auth/wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicKey: wallet.publicKey.toString(),
    signature: bs58.encode(signature),
    message: message
  })
});

const { accessToken } = await response.json();
```

### Створення сертифікату
```javascript
const certificate = await fetch('/certificates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + accessToken,
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

### Мінтинг NFT
```javascript
const nft = await fetch(`/certificates/${certificateId}/mint`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + accessToken }
});
```

### Перевірка сертифікату
```javascript
const verification = await fetch(
  `/certificates/${certificateId}/verify?publicKey=${publicKey}`
);
const { isValid } = await verification.json();
```

## Структура проекту

```
src/
├── common/
│   ├── entities/          # Сутності бази даних
│   │   ├── user.entity.ts
│   │   └── medical-certificate.entity.ts
│   └── types/             # Загальні типи
│       └── index.ts
├── modules/
│   ├── auth/              # Модуль авторизації
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── certificates/      # Модуль сертифікатів
│   │   ├── certificates.controller.ts
│   │   ├── certificates.service.ts
│   │   ├── certificates.module.ts
│   │   └── dto/
│   └── solana/            # Модуль Solana
│       ├── solana.service.ts
│       └── solana.module.ts
├── app.controller.ts      # Головний контролер
├── app.module.ts          # Головний модуль
└── main.ts               # Точка входу
```

## API Endpoints

### Авторизація
- `POST /auth/wallet` - Авторизація через криптогаманець
- `GET /auth/profile` - Отримання профілю користувача
- `GET /auth/test` - Тестовий endpoint

### Сертифікати
- `POST /certificates` - Створення сертифікату
- `POST /certificates/:id/mint` - Мінтинг NFT для сертифікату
- `GET /certificates/:id` - Отримання сертифікату за ID
- `GET /certificates/patient/:patientId` - Сертифікати пацієнта
- `GET /certificates/doctor/:doctorId` - Сертифікати лікаря
- `GET /certificates/:id/verify` - Перевірка сертифікату
- `GET /certificates/:id/nft-metadata` - Метадані NFT
- `GET /certificates/test` - Тестовий endpoint

### Системні
- `GET /` - Головна сторінка
- `GET /health` - Перевірка здоров'я сервісу
- `GET /api` - Swagger документація

## Типи сертифікатів

- `vaccination` - Вакцинація
- `medical_examination` - Медичний огляд
- `laboratory_test` - Лабораторний тест
- `prescription` - Рецепт
- `surgical_report` - Хірургічний звіт

## Статуси сертифікатів

- `pending` - В очікуванні
- `issued` - Видано
- `expired` - Застарів
- `revoked` - Відкликано

## Безпека

- Всі приватні ключі зберігаються в змінних середовища
- JWT токени мають обмежений термін дії (7 днів)
- Перевірка підпису гаманця для авторизації
- Валідація всіх вхідних даних через class-validator
- CORS налаштований для безпеки

## Розробка

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

### Логування
Додаток використовує вбудоване логування NestJS. Всі важливі операції логуються з відповідними рівнями (log, error, warn).

### Обробка помилок
Всі помилки обробляються централізовано через глобальні фільтри NestJS. Користувачі отримують зрозумілі повідомлення про помилки. 