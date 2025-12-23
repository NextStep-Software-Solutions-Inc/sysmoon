# Node.js Examples

Examples demonstrating the Sysmoon JavaScript SDK.

## Prerequisites

1. Start the Sysmoon server:
   ```bash
   cd ../../
   pnpm dev
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Examples

### Basic Usage

Demonstrates system registration and sending events:

```bash
node basic-usage.js
```

This will:
1. Register a new system
2. Send individual events
3. Send batch events
4. Display the API key (save it!)

### Real-time Streaming

Demonstrates WebSocket connection and real-time event streaming:

```bash
# First, set your API key from the basic example
export SYSMOON_API_KEY="your-api-key-here"

node realtime-streaming.js
```

This will:
1. Connect to the WebSocket stream
2. Subscribe to all events
3. Display events as they arrive
4. Send heartbeat events every 5 seconds

Press Ctrl+C to exit.

## View Events

Open http://localhost:3000 to see events in the dashboard.
