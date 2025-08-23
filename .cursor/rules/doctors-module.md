## Doctors Module (NestJS) — Rules and Conventions

### 1. Purpose
- **Goal**: Provide CRUD and search for doctors as basic users of the admin system.
- **Scope**: Manage doctors with minimal profile fields and unique identifiers for email and wallet.

### 2. Tech Context
- **Runtime**: Node.js v20.x, TypeScript 5.x
- **Framework**: NestJS 11 (Controllers/Services/Modules)
- **ORM**: TypeORM 0.3.x + PostgreSQL
- **Validation**: class-validator + class-transformer with global `ValidationPipe`
- **Docs**: @nestjs/swagger

### 3. Data Model (TypeORM Entity)
- File: `src/doctors/entities/doctor.entity.ts`
- Table: `doctors`
- Fields:
  - `id: uuid` — primary key
  - `fullName: varchar(200)` — required
  - `email: varchar(320)` — required, unique, indexed
  - `walletAddress: varchar(100)` — required, unique, indexed
  - `phone?: varchar(20)` — optional
  - `specialization?: varchar(120)` — optional
  - `createdAt: timestamp` — auto
  - `updatedAt: timestamp` — auto

### 4. DTOs and Validation
- Files:
  - `src/doctors/dto/create-doctor.dto.ts`
  - `src/doctors/dto/update-doctor.dto.ts`
  - `src/doctors/dto/query-doctors.dto.ts`
- Rules:
  - Create:
    - `fullName: string, 2..200`
    - `email: email`
    - `walletAddress: string, 20..100`
    - `phone?: string` (basic phone regex allowed)
    - `specialization?: string, 2..120`
  - Update: `PartialType(CreateDoctorDto)`
  - Query (pagination + filters):
    - `page? number >= 1` (default 1)
    - `limit? number` (default 10)
    - `search? string` — ILIKE across `fullName`, `email`, `walletAddress`
    - `email? string` — exact match
    - `walletAddress? string` — exact match

### 5. Service Behavior
- File: `src/doctors/doctors.service.ts`
- Use `Repository<Doctor>` via `@InjectRepository(Doctor)`.
- Methods:
  - `create(dto)` → save entity
  - `findAll(query)` → `findAndCount` with pagination; `ILike` for `search` on `fullName`, `email`, `walletAddress`; order by `createdAt DESC`; returns `{ items, meta }`
  - `findOne(id)` → throws `NotFoundException` if missing
  - `update(id, dto)` → `preload` + save; throws `NotFoundException` if missing
  - `remove(id)` → delete after existence check

### 6. Controller & API
- File: `src/doctors/doctors.controller.ts`
- Decorators: `@ApiTags('doctors')`
- Routes:
  - `POST /doctors` — create doctor
  - `GET /doctors` — list doctors with pagination/search
  - `GET /doctors/:id` — get doctor by id (UUID)
  - `PATCH /doctors/:id` — update doctor by id
  - `DELETE /doctors/:id` — delete doctor by id
- Validation is automatic via global `ValidationPipe` and DTOs.
- Swagger responses and params should be declared via `@ApiOperation`, `@ApiResponse`, `@ApiParam` where applicable.

### 7. Module Wiring
- File: `src/doctors/doctors.module.ts`
- `imports: [TypeOrmModule.forFeature([Doctor])]`
- Export `DoctorsService` if other modules need it.
- App integration: `DoctorsModule` is imported in `src/app.module.ts`.

### 8. Conventions & Constraints
- Always use DTOs in controllers; never access repositories in controllers.
- Keep unique constraints on `email` and `walletAddress` in the entity.
- Use explicit pagination responses:
  - `meta: { totalItems, itemCount, perPage, totalPages, currentPage }`
- Sorting: default `createdAt DESC` for listings.
- Keep error messages concise and consistent (e.g., `Doctor not found`).

### 9. Key Files & Paths
- `src/doctors/entities/doctor.entity.ts`
- `src/doctors/dto/create-doctor.dto.ts`
- `src/doctors/dto/update-doctor.dto.ts`
- `src/doctors/dto/query-doctors.dto.ts`
- `src/doctors/doctors.service.ts`
- `src/doctors/doctors.controller.ts`
- `src/doctors/doctors.module.ts`
- App registration: `src/app.module.ts`

### 10. Testing & Docs
- Add e2e tests for CRUD and search when feasible.
- Ensure `/api-docs` includes the Doctors tag and endpoints.


