# Demo E-Commerce Application

A dummy 3rd party e-commerce application that demonstrates the Sysmoon JavaScript SDK in action.

## Features

This demo app simulates a real e-commerce platform and showcases:

- **System Registration**: Automatically registers with Sysmoon on startup
- **Event Types**: 
  - `app.started` / `app.shutdown` - Application lifecycle
  - `order.created` / `order.validation_failed` / `order.creation_failed` - Order management
  - `payment.processed` / `payment.failed` / `payment.error` - Payment processing
  - `health.check` - Health monitoring
  - `user.browsing` / `inventory.check` / `cache.hit` - Background activities
- **Severity Levels**: info, warning, error, critical
- **Event Sending**: Sends events to backend via HTTP/REST
- **Background Activity**: Simulates continuous application activity

## Prerequisites

- Node.js 20+ (LTS)
- Sysmoon backend running on `http://localhost:3000` (or configure via env var)

## Installation

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
SYSMOON_API_URL=http://localhost:3000 PORT=4000 pnpm start
```

### Environment Variables

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

1. Open the Sysmoon dashboard at `http://localhost:3000/dashboard`
2. You should see the "Demo E-Commerce Platform" system registered
3. Click on it to filter events from this application
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

1. **SDK Integration**: How to integrate Sysmoon SDK in a Node.js application
2. **Registration Flow**: Automatic system registration on startup
3. **Event Tracking**: Comprehensive event tracking across the application
4. **Error Handling**: Proper error event logging with severity levels
5. **Event Sending**: HTTP/REST API for sending events to backend
6. **Continuous Activity**: Background events simulating real-world usage
7. **Graceful Shutdown**: Proper cleanup and shutdown event logging

## Architecture

```
Demo App (Express)
       |
       ├── Sysmoon SDK (@sysmoon/sdk-js)
       |     └── HTTP Client (registration, event sending)
       |
       └── Sysmoon Backend
             ├── API (registration, event ingestion)
             ├── Database (PostgreSQL)
             └── Real-time Broker (Socket.IO)
                   |
                   └── Dashboard UI (receives events via WebSocket)
```

## Troubleshooting

**Connection Refused Error:**
- Make sure the Sysmoon backend is running on the configured URL
- Default is `http://localhost:3000`

**Events Not Appearing in Dashboard:**
- Check that the system is registered (look for success message in console)
- Verify the API key is being used (stored automatically after registration)
- Refresh the dashboard or check that it's connected to the backend WebSocket

**App Crashes on Startup:**
- Ensure Node.js 20+ is installed: `node --version`
- Install dependencies: `pnpm install`
- Check that port 4000 is available or set a different PORT env var
