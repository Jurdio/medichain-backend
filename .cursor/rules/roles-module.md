## Roles Module (NestJS) — Rules and Conventions

### 1. Purpose
- **Goal**: Manage role-based access with grouped JSON permissions.
- **Scope**: CRUD for roles; each role defines permissions for modules grouped by domains.

### 2. Tech Context
- **Runtime**: Node.js v20.x, TypeScript 5.x
- **Framework**: NestJS 11
- **ORM**: TypeORM 0.3.x + PostgreSQL
- **Validation**: class-validator + class-transformer with global `ValidationPipe`
- **Docs**: @nestjs/swagger

### 3. Data Model (TypeORM Entity)
- File: `src/roles/entities/role.entity.ts`
- Table: `roles`
- Fields:
  - `id: uuid` — primary key
  - `name: varchar(120)` — required, unique, indexed
  - `slug: varchar(120)` — required, unique, indexed
  - `description?: varchar(300)` — optional
  - `permissions: jsonb` — required; grouped per domains:
    - `Users`: `{ [module: string]: { read: boolean, save: boolean } }`
      - typically includes: `doctors`
    - `Documents`: `{ [module: string]: { read: boolean, save: boolean } }`
      - typically includes: `settings`, `protect`, `history`, `verify`, `roles`, `directions`, `certificateTypes`
  - `createdAt: timestamp` — auto
  - `updatedAt: timestamp` — auto
- Relations:
  - `OneToMany(Role -> Doctor)` via `Doctor.role`

### 4. DTOs and Validation
- Files:
  - `src/roles/dto/create-role.dto.ts`
  - `src/roles/dto/update-role.dto.ts`
- Rules:
  - Create:
    - `name: string, 2..120`
    - `slug: string, 2..120`
    - `description?: string, 0..300`
    - `permissions: { Users?: Record<string,{read:boolean,save:boolean}>, Documents?: Record<string,{read:boolean,save:boolean}> }`
  - Update: `PartialType(CreateRoleDto)`

### 5. Service Behavior
- File: `src/roles/roles.service.ts`
- Use `Repository<Role>` via `@InjectRepository(Role)`.
- Methods:
  - `create(dto)` → create + save
  - `findAll()` → list, order `createdAt DESC`
  - `findOne(id)` → throws `NotFoundException` if missing
  - `update(id, dto)` → merge + save
  - `remove(id)` → delete after existence check

### 6. Controller & API
- File: `src/roles/roles.controller.ts`
- Decorators: `@ApiTags('roles')`
- Routes:
  - `POST /roles` — create role
  - `GET /roles` — list roles
  - `GET /roles/:id` — get role by id
  - `PATCH /roles/:id` — update role
  - `DELETE /roles/:id` — delete role
- Validation is enforced via DTOs and global `ValidationPipe`.

### 7. Module Wiring
- File: `src/roles/roles.module.ts`
- `imports: [TypeOrmModule.forFeature([Role])]`
- Export `RolesService` if needed by other modules (e.g., Doctors).
- App integration: `RolesModule` is imported in `src/app.module.ts`.

### 8. Conventions & Constraints
- Keep `slug` stable for programmatic checks.
- Use grouped permissions by domains `Users` and `Documents`.
- Actions supported: `read`, `save` only (expandable later).
- Error messages concise (e.g., `Role not found`).

### 9. Key Files & Paths
- `src/roles/entities/role.entity.ts`
- `src/roles/dto/create-role.dto.ts`
- `src/roles/dto/update-role.dto.ts`
- `src/roles/roles.service.ts`
- `src/roles/roles.controller.ts`
- `src/roles/roles.module.ts`
- App registration: `src/app.module.ts`


