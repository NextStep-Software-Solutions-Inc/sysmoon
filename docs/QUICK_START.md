# Quick Start Guide

Get Sysmoon up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check pnpm (need 8+)
pnpm --version

# Check PostgreSQL (need 14+)
psql --version

# If missing, install:
# Node.js: https://nodejs.org
# pnpm: npm install -g pnpm
# PostgreSQL: https://www.postgresql.org/download
```

## Step 1: Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/NextStep-Software-Solutions-Inc/sysmoon.git
cd sysmoon

# Install all dependencies
pnpm install
```

## Step 2: Configure Database (1 min)

```bash
# Create PostgreSQL database
createdb sysmoon

# Or using psql:
psql -c "CREATE DATABASE sysmoon;"

# Copy environment file
cp packages/database/.env.example packages/database/.env

# Edit packages/database/.env:
# DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/sysmoon"
```

## Step 3: Initialize Database (1 min)

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

## Step 4: Configure Apps (30 sec)

```bash
# Server API
cp apps/server-api/.env.example apps/server-api/.env.local
# Edit apps/server-api/.env.local with your DATABASE_URL

# Dashboard
cp apps/dashboard/.env.example apps/dashboard/.env.local
# Default values should work for local dev
```

## Step 5: Start Development Servers (30 sec)

```bash
# Start everything
pnpm dev
```

This starts:
- 📊 **Dashboard**: http://localhost:3000
- 🔌 **API Server**: http://localhost:3001
- 📡 **WebSocket**: ws://localhost:3001/api/socket

## Step 6: Test It! (1 min)

### Option A: Use the Dashboard

1. Open http://localhost:3000
2. Click "Register New System"
3. Enter name: "Test App"
4. Copy the API key shown
5. See it appear in the systems list!

### Option B: Use curl

```bash
# Register a system
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test System","description":"My first system"}'

# Copy the apiKey from response, then send an event:
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY_HERE" \
  -d '{
    "eventType": "test.event",
    "payload": {"message": "Hello Sysmoon!"},
    "severity": "info"
  }'

# Watch it appear in the dashboard in real-time!
```

### Option C: Run Example Code

```bash
# Node.js example
cd examples/nodejs
node basic-usage.js

# C# example (if you have .NET)
cd examples/csharp
dotnet run
```

## Step 7: Try the SDKs

### JavaScript SDK

```bash
# In your project
npm install @sysmoon/sdk-js

# Or link locally (for development)
cd sysmoon/sdks/js
pnpm link --global

# In your project
pnpm link --global @sysmoon/sdk-js
```

```javascript
import SysmoonClient from '@sysmoon/sdk-js';

const client = new SysmoonClient({
  apiUrl: 'http://localhost:3001',
  apiKey: 'your-api-key'
});

await client.sendEvent({
  eventType: 'user.login',
  payload: { userId: '123' },
  severity: 'info'
});
```

### C# SDK

```bash
# In your project directory
dotnet add reference path/to/sysmoon/sdks/csharp/Sysmoon.SDK/Sysmoon.SDK.csproj
```

```csharp
using Sysmoon.SDK;

var client = new SysmoonClient(new SysmoonConfig
{
    ApiUrl = "http://localhost:3001",
    ApiKey = "your-api-key"
});

await client.SendEventAsync(new EventData
{
    EventType = "user.login",
    Payload = new { UserId = "123" },
    Severity = "info"
});
```

## 🎉 You're Ready!

Your Sysmoon instance is now running! Here's what you can do:

### Dashboard Features
- ✅ Register new systems
- ✅ View all registered systems
- ✅ See real-time events as they arrive
- ✅ Filter events by clicking systems
- ✅ Monitor connection status

### Next Steps

1. **Send More Events**: Try different event types and severities
2. **Test Real-time**: Open dashboard in multiple browsers
3. **Try Filtering**: Click systems to filter events
4. **Batch Events**: Send multiple events at once
5. **Explore API**: Try the `/api/events/query` endpoint

### Useful Commands

```bash
# Stop servers
# Press Ctrl+C in the terminal

# Restart with fresh data
pnpm db:migrate reset
pnpm db:migrate

# View database
pnpm db:studio

# Build for production
pnpm build

# Run production build
cd apps/server-api && pnpm start
cd apps/dashboard && pnpm start
```

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Port Already in Use
```bash
# Change port in .env.local files
# Or kill process using port
lsof -ti:3001 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Prisma Client Not Generated
```bash
pnpm db:generate
```

## Documentation

For more details, see:
- 📖 [README.md](../README.md) - Full documentation
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- 🔌 [API.md](./API.md) - API reference
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- 🤝 [CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute

## Need Help?

- Check the documentation
- Review the examples in `examples/`
- Open an issue on GitHub
- Check existing issues for solutions

---

**Happy Monitoring! 🎯**
