# Sysmoon (Unified Next.js App - App Router)

**Platform-agnostic real-time monitoring system**

Sysmoon is an extensible monitoring platform that enables real-time monitoring of registered systems (apps/services) with multi-protocol support for real-time delivery (WebSocket, SignalR, SSE), pluggable SDKs (JavaScript & C#), and a fully customizable dashboard UI.

## 🌟 Features

- **Real-time Event Monitoring**: Stream events from your applications in real-time
- **Multi-Protocol Support**: WebSocket, SignalR, SSE, and HTTP/REST
- **Lightweight SDKs**: Easy-to-use JavaScript/TypeScript and C# SDKs
- **Customizable Dashboard**: Next.js-based UI with filtering and real-time updates
- **Event Filtering**: Filter events by system, type, and severity
- **Batch Event Processing**: Send multiple events efficiently
- **PostgreSQL Storage**: Persistent event storage with full query capabilities
- **API Key Authentication**: Secure system registration and event ingestion
- **Unified Architecture**: Single Next.js app with App Router for simplified deployment

## 🏗️ Architecture

```
┌─────────────────────┐   HTTP/WS/SignalR      ┌────────────────────┐
│ Monitored System    │------------------------>│  Unified Next.js   │
│      (SDK)          │   Emit Events, Auth     │  App (App Router)  │
└─────────────────────┘                         │                    │
                                                 │  • API Routes      │
                                                 │  • Dashboard UI    │
                                                 │  • WebSocket       │
                                                 └────────────────────┘
                                                          |
                                                   [Event Processor]
                                                          |
                                                  ┌────────────────────┐
                                                  │   PostgreSQL DB    │
                                                  │ (Events, Systems)  │
                                                  └────────────────────┘
```

## 📁 Repository Structure

```
sysmoon/
├── app/                    # Next.js App Router
│   ├── api/                # API route handlers
│   │   ├── register/       # System registration
│   │   ├── events/         # Event ingestion & query
│   │   └── systems/        # Systems list
│   ├── dashboard/          # Dashboard UI
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # Shared UI components
├── lib/                    # Shared utilities and services
│   ├── services/           # Event processor, etc.
│   ├── hooks/              # React hooks
│   ├── api.ts              # API client functions
│   ├── auth.ts             # Authentication utilities
│   └── prisma.ts           # Database client
├── packages/
│   └── database/           # Prisma schema
├── sdks/
│   ├── js/                 # JavaScript/TypeScript SDK
│   └── csharp/             # C#/.NET SDK
├── demo-apps/              # Demo 3rd party applications
│   ├── ecommerce-nodejs/   # E-commerce demo (Node.js)
│   └── monitoring-csharp/  # Monitoring service (C#)
├── public/                 # Static assets
├── server.ts               # Custom server with WebSocket
├── next.config.js          # Next.js configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (LTS) and pnpm 9+
- PostgreSQL 14+
- .NET 8.0+ (for C# SDK development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NextStep-Software-Solutions-Inc/sysmoon.git
   cd sysmoon
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   
   Copy the example file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/sysmoon"
   PORT=3000
   NODE_ENV=development
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```
   
   Also set up the database package:
   ```bash
   cp packages/database/.env.example packages/database/.env
   ```
   
   Edit `packages/database/.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/sysmoon"
   ```

4. **Initialize the database:**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

   This will start:
   - Dashboard: http://localhost:3000/dashboard
   - API: http://localhost:3000/api/*
   - WebSocket: ws://localhost:3000/api/socket

## 🎮 Demo Applications

Sysmoon includes fully functional demo applications that showcase SDK integration in real-world scenarios:

### E-Commerce Platform (Node.js)
```bash
cd demo-apps/ecommerce-nodejs
pnpm install
pnpm start
```

Features:
- Order management with event tracking
- Payment processing simulation
- Real-time WebSocket streaming
- Background activity simulation

### System Monitoring Service (C#)
```bash
cd demo-apps/monitoring-csharp
dotnet run
```

Features:
- CPU, memory, disk, and network metrics
- Batch event sending
- SignalR real-time streaming
- Anomaly detection

See [`demo-apps/README.md`](./demo-apps/README.md) for detailed documentation.

## 📚 Usage

### 1. Register a System

Use the dashboard at http://localhost:3000/dashboard or API directly:

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"My App","description":"Production server"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "systemId": "uuid",
    "apiKey": "uuid",
    "name": "My App"
  }
}
```

**Save the API key securely!**

### 2. Send Events with JavaScript SDK

```bash
npm install @sysmoon/sdk-js
```

```javascript
import SysmoonClient from '@sysmoon/sdk-js';

const client = new SysmoonClient({
  apiUrl: 'http://localhost:3000',
  apiKey: 'your-api-key-here'
});

// Send single event
await client.sendEvent({
  eventType: 'user.login',
  payload: { userId: '123', ip: '192.168.1.1' },
  severity: 'info'
});

// Real-time streaming
client.connectRealTime({
  onConnect: () => console.log('Connected'),
});

client.subscribe({ eventType: 'user.login' }, (event) => {
  console.log('New event:', event);
});
```

### 3. Send Events with C# SDK

```bash
dotnet add package Sysmoon.SDK
```

```csharp
using Sysmoon.SDK;

var client = new SysmoonClient(new SysmoonConfig
{
    ApiUrl = "http://localhost:3000",
    ApiKey = "your-api-key-here"
});

// Send single event
await client.SendEventAsync(new EventData
{
    EventType = "user.login",
    Payload = new { UserId = "123", Ip = "192.168.1.1" },
    Severity = "info"
});

// Real-time streaming
await client.ConnectRealTimeAsync();
await client.SubscribeAsync(
    callback: (evt) => Console.WriteLine($"Event: {evt}"),
    eventType: "user.login"
);
```

## 🔌 API Endpoints

All endpoints are served from the single Next.js app:

### POST `/api/register`
Register a new monitored system

### POST `/api/events`
Ingest events (requires `X-API-Key` header)

### GET `/api/systems`
List all registered systems

### GET `/api/events/query`
Query historical events

**Parameters:**
- `systemId` - Filter by system
- `eventType` - Filter by event type
- `severity` - Filter by severity (comma-separated)
- `limit` - Results per page (default: 100)
- `offset` - Pagination offset

### WebSocket `/api/socket`
Real-time event streaming

```javascript
socket.emit('subscribe', {
  systemId: 'optional',
  eventType: 'optional',
  severity: ['error', 'critical']
});

socket.on('event', (event) => {
  console.log('New event:', event);
});
```

## 🔒 Security

- All event endpoints require API key authentication
- API keys are generated during system registration
- Store API keys securely (environment variables, secrets manager)
- CORS configuration for dashboard access

## 🛠️ Development

### Project Commands

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Database operations
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

## 📖 Data Flow

The unified architecture follows this pattern:

```
3rd Party System/SDK --(HTTP/WS)--> /app/api/*/route.ts (server)
                                              |
                                        Event Processor
                                              |
                                     +--------+--------+
                                     |                 |
                                PostgreSQL      WebSocket Broadcast
                                     |                 |
                                     v                 v
                       Historical Query UI      Live Dashboard UI
                         (/dashboard)            (/dashboard)
```

Key principles:
- UI routes in `/app` (dashboard, register, etc.)
- API routes in `/app/api` (REST endpoints)
- WebSocket managed by custom server (`server.ts`)
- Shared code in `/lib` (services, utilities)
- UI components in `/components`

## 🚢 Deployment

### Single Deployment

The unified architecture allows deployment as a single Next.js application:

**Vercel (Recommended):**
```bash
vercel deploy
```

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
ENV NODE_ENV=production
CMD ["pnpm", "start"]
```

**Environment Variables:**
Set these in your deployment platform:
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: production
- `NEXT_PUBLIC_API_URL`: Your deployment URL

## 📝 Migration from Separate Apps

This version consolidates the previous monorepo structure (`apps/dashboard` + `apps/server-api`) into a single Next.js App Router application for:
- **Simplified deployment**: One app to deploy instead of two
- **Easier development**: Single dev server
- **Better performance**: Reduced network overhead
- **Unified codebase**: Shared utilities and components

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 💬 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review API examples in SDK documentation

---

Built with ❤️ by NextStep Software Solutions Inc.
