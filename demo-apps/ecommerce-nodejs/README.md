# Demo E-Commerce Application

A dummy 3rd party e-commerce application that demonstrates the Sysmoon JavaScript SDK in action.

## Features

This demo app simulates a real e-commerce platform and showcases:

- **Dashboard-Driven Registration**: Uses API key from Sysmoon dashboard
- **Event Types**: 
  - `app.started` / `app.shutdown` - Application lifecycle
  - `order.created` / `order.validation_failed` / `order.creation_failed` - Order management
  - `payment.processed` / `payment.failed` / `payment.error` - Payment processing
  - `health.check` - Health monitoring
  - `user.browsing` / `inventory.check` / `cache.hit` - Background activities
- **Severity Levels**: info, warning, error, critical
- **Event Sending**: Sends events to backend via HTTP/REST with API key authentication
- **Background Activity**: Simulates continuous application activity

## Prerequisites

- Node.js 20+ (LTS)
- Sysmoon backend running on `http://localhost:3000` (or configure via env var)
- **API Key from Sysmoon dashboard** (see Setup below)

## Setup

### 1. Register System in Sysmoon Dashboard

Before running the demo, you need to register a system and get an API key:

1. Start the Sysmoon backend: `pnpm dev`
2. Navigate to `http://localhost:3000/systems`
3. Click "Register New System"
4. Enter system details:
   - Name: "Demo E-Commerce Platform"
   - Description: "A demo e-commerce application showcasing Sysmoon monitoring"
5. Click "Register"
6. **Copy the API key** (shown only once!)

### 2. Configure Environment Variables

Create a `.env` file or export the environment variable:

```bash
# Option 1: Create .env file
echo "SYSMOON_API_KEY=your-api-key-here" > .env

# Option 2: Export environment variable
export SYSMOON_API_KEY="your-api-key-here"
```

### 3. Install Dependencies

```bash
# From the demo-apps/ecommerce-nodejs directory
pnpm install
```

Or from the repository root:

```bash
# Install all dependencies including demo apps
pnpm install
```

## Usage

### Start the Demo App

```bash
# From the demo-apps/ecommerce-nodejs directory
pnpm start

# Or with custom configuration
SYSMOON_API_URL=http://localhost:3000 SYSMOON_API_KEY=your-key PORT=4000 pnpm start
```

### Environment Variables

- `SYSMOON_API_KEY` - **REQUIRED**: API key from dashboard registration
- `SYSMOON_API_URL` - URL of the Sysmoon backend (default: `http://localhost:3000`)
- `PORT` - Port for the demo app to run on (default: `4000`)

### Test the Endpoints

**Create an Order:**
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust123",
    "items": ["laptop", "mouse", "keyboard"],
    "total": 1299.99
  }'
```

**Process a Payment:**
```bash
curl -X POST http://localhost:4000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "amount": 1299.99,
    "method": "credit_card"
  }'
```

**Health Check:**
```bash
curl http://localhost:4000/health
```

**List Orders:**
```bash
curl http://localhost:4000/api/orders
```

## Monitoring

Once the app is running:

1. Open the Sysmoon Events page at `http://localhost:3000/events`
2. You should see events from the "Demo E-Commerce Platform" system
3. Filter by your system to see only your events
4. Watch real-time events as you interact with the API
5. Background events will appear every 10 seconds

## Events Generated

### On Startup
- `app.started` - Application initialization complete

### API Interactions
- `order.created` - When an order is successfully created
- `order.validation_failed` - When order validation fails
- `order.creation_failed` - When order creation encounters an error
- `payment.processed` - Successful payment (80% probability)
- `payment.failed` - Failed payment (20% probability)
- `payment.error` - Payment processing error
- `health.check` - Health check endpoint called
- `orders.listed` - Orders list retrieved

### Background Activity (Every 10s)
- `user.browsing` - Simulated user browsing activity
- `inventory.check` - Inventory status check
- `cache.hit` - Cache performance metrics

### On Shutdown
- `app.shutdown` - Graceful shutdown signal

## What This Demonstrates

1. **Dashboard-Driven Registration**: How to use pre-configured API keys from the dashboard
2. **SDK Integration**: How to integrate Sysmoon SDK in a Node.js application
3. **Event Tracking**: Comprehensive event tracking across the application
4. **Error Handling**: Proper error event logging with severity levels
5. **Event Sending**: Authenticated HTTP/REST API for sending events to backend
6. **Continuous Activity**: Background events simulating real-world usage
7. **Graceful Shutdown**: Proper cleanup and shutdown event logging

## Architecture

```
Sysmoon Dashboard
      |
      ├── Register System
      └── Get API Key
            |
            v
Demo App (Express) <-- Configured with API Key
      |
      ├── Sysmoon SDK (@sysmoon/sdk-js)
      |     └── HTTP Client (authenticated event sending)
      |
      └── Sysmoon Backend
            ├── API (validates API key, event ingestion)
            ├── Database (PostgreSQL)
            └── Real-time Broker (Socket.IO)
                  |
                  └── Dashboard Events UI (receives events via WebSocket)
```

## Troubleshooting

**Missing API Key Error:**
- Make sure you've registered the system in the dashboard at `/systems`
- Copy the API key and set the `SYSMOON_API_KEY` environment variable
- The API key is shown only once during registration

**Connection Refused Error:**
- Make sure the Sysmoon backend is running on the configured URL
- Default is `http://localhost:3000`

**Events Not Appearing in Dashboard:**
- Check that the API key is correctly set in your environment
- Verify the system is registered in the dashboard at `/systems`
- Check the `/events` page for real-time event display
- Ensure the backend is running and accessible

**App Crashes on Startup:**
- Ensure Node.js 20+ is installed: `node --version`
- Install dependencies: `pnpm install`
- Check that port 4000 is available or set a different PORT env var
- Verify `SYSMOON_API_KEY` is set correctly
