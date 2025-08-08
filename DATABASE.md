# Database Setup with Drizzle ORM

This project uses Drizzle ORM with PostgreSQL for database management.

## Prerequisites

1. Install PostgreSQL on your system
2. Create a database for the project

## Environment Setup

1. Copy the `.env.local` file and update the `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/management_app"
```

Replace:
- `username`: Your PostgreSQL username
- `password`: Your PostgreSQL password
- `localhost:5432`: Your PostgreSQL host and port
- `management_app`: Your database name

## Database Commands

### Generate Migration Files
```bash
npm run db:generate
```

### Apply Migrations to Database
```bash
npm run db:migrate
```

### Push Schema Changes (Development)
```bash
npm run db:push
```

### Open Drizzle Studio (Database GUI)
```bash
npm run db:studio
```

## Database Schema

The current schema includes:

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `name` (VARCHAR)
- `password` (TEXT)
- `role` (VARCHAR, Default: 'user')
- `isActive` (BOOLEAN, Default: true)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Projects Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `status` (VARCHAR, Default: 'active')
- `ownerId` (UUID, Foreign Key to Users)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Tasks Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (VARCHAR, Default: 'pending')
- `priority` (VARCHAR, Default: 'medium')
- `projectId` (UUID, Foreign Key to Projects)
- `assigneeId` (UUID, Foreign Key to Users)
- `dueDate` (TIMESTAMP)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Usage Examples

### Creating a User
```typescript
import { userOperations } from '@/db/queries';

const newUser = await userOperations.create({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'hashedPassword',
  role: 'user'
});
```

### Querying Data
```typescript
import { db } from '@/db';
import { users, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Get user with their projects
const userWithProjects = await db
  .select()
  .from(users)
  .leftJoin(projects, eq(users.id, projects.ownerId))
  .where(eq(users.id, userId));
```

## API Routes

The following API routes are available:

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## Development Workflow

1. Make changes to `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Test your changes
