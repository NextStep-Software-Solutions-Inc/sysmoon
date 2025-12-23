# Database Package

This package contains the Prisma schema and generated client for the Sysmoon monitoring system.

## Setup

1. Set the `DATABASE_URL` environment variable:
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/sysmoon"
```

2. Generate Prisma Client:
```bash
pnpm generate
```

3. Run migrations:
```bash
pnpm migrate
```

## Schema Overview

- **System**: Represents a registered monitored system/application
- **Event**: Stores all events emitted by systems
- **User**: Dashboard users with authentication
- **DashboardLayout**: Saved dashboard configurations per user
