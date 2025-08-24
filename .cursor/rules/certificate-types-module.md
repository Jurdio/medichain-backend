## CertificateTypes Module (NestJS) — Rules and Conventions

### 1. Purpose
- **Goal**: Manage certificate type definitions used across directions and protection flows.
- **Scope**: CRUD for certificate types and many-to-many linking to directions.

### 2. Tech Context
- **Runtime**: Node.js v20.x, TypeScript 5.x
- **Framework**: NestJS 11
- **ORM**: TypeORM 0.3.x + PostgreSQL
- **Validation**: class-validator + class-transformer with global `ValidationPipe`
- **Docs**: @nestjs/swagger

### 3. Data Model (TypeORM Entity)
- File: `src/certificate-types/entities/certificate-type.entity.ts`
- Table: `certificate_types`
- Fields:
  - `id: uuid` — primary key
  - `name: varchar(120)` — required, unique, indexed
  - `slug: varchar(120)` — required, unique, indexed
  - `description?: varchar(300)` — optional
  - `createdAt: timestamp` — auto
  - `updatedAt: timestamp` — auto
- Relations:
  - `ManyToMany(CertificateType <-> Direction)` using join table `direction_certificate_types`

### 4. DTOs and Validation
- Files:
  - `src/certificate-types/dto/create-certificate-type.dto.ts`
  - `src/certificate-types/dto/update-certificate-type.dto.ts`
- Rules:
  - Create:
    - `name: string, 2..120`
    - `slug: string, 2..120`
    - `description?: string, 0..300`
    - `directionIds?: string[] (uuid)` — optional, to set initial links
  - Update: `PartialType(CreateCertificateTypeDto)`
    - If `directionIds` provided, replaces the entire relation set

### 5. Service Behavior
- File: `src/certificate-types/certificate-types.service.ts`
- Use `Repository<CertificateType>` and `Repository<Direction>`.
- Methods:
  - `create(dto)` → create + optionally link directions; save
  - `findAll()` → list with `directions` relation, order `createdAt DESC`
  - `findOne(id)` → load with `directions`; 404 if missing
  - `update(id, dto)` → merge fields; if `directionIds` present, replace links
  - `remove(id)` → delete after existence check

### 6. Controller & API
- File: `src/certificate-types/certificate-types.controller.ts`
- Decorators: `@ApiTags('certificate-types')`
- Routes:
  - `POST /certificate-types` — create certificate type (accepts `directionIds`)
  - `GET /certificate-types` — list with relations
  - `GET /certificate-types/:id` — get by id
  - `PATCH /certificate-types/:id` — update; replace links if `directionIds` provided
  - `DELETE /certificate-types/:id` — delete

### 7. Module Wiring
- File: `src/certificate-types/certificate-types.module.ts`
- `imports: [TypeOrmModule.forFeature([CertificateType, Direction])]`
- Export `CertificateTypesService` if needed elsewhere.
- App integration: `CertificateTypesModule` is imported in `src/app.module.ts`.

### 8. Conventions & Constraints
- Keep `slug` stable and unique.
- Replace-not-merge behavior when arrays of relation IDs are provided in update.
- Error messages concise (e.g., `CertificateType not found`).

### 9. Key Files & Paths
- `src/certificate-types/entities/certificate-type.entity.ts`
- `src/certificate-types/dto/create-certificate-type.dto.ts`
- `src/certificate-types/dto/update-certificate-type.dto.ts`
- `src/certificate-types/certificate-types.service.ts`
- `src/certificate-types/certificate-types.controller.ts`
- `src/certificate-types/certificate-types.module.ts`
- App registration: `src/app.module.ts`


