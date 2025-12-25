// Example: Real-time event streaming with JavaScript SDK
import SysmoonClient from '@sysmoon/sdk-js';

const client = new SysmoonClient({
  apiUrl: 'http://localhost:3001',
  apiKey: process.env.SYSMOON_API_KEY, // Set this environment variable
});

async function main() {
  if (!process.env.SYSMOON_API_KEY) {
    console.error('Please set SYSMOON_API_KEY environment variable');
    process.exit(1);
  }

  console.log('Connecting to real-time stream...');
  
  // Connect to WebSocket
  client.connectRealTime({
    onConnect: () => {
      console.log('✓ Connected to Sysmoon real-time stream\n');
      
      // Subscribe to all events
      client.subscribe({}, (event) => {
        console.log('📨 New event received:');
        console.log(`  Type: ${event.eventType}`);
        console.log(`  System: ${event.systemName}`);
        console.log(`  Severity: ${event.severity}`);
        console.log(`  Timestamp: ${event.timestamp}`);
        console.log(`  Payload:`, event.payload);
        console.log('');
      });
      
      console.log('Listening for events... Press Ctrl+C to exit.\n');
      
      // Send a test event every 5 seconds
      setInterval(async () => {
        await client.sendEvent({
          eventType: 'heartbeat',
          payload: {
            timestamp: new Date().toISOString(),
            status: 'healthy',
          },
          severity: 'info',
        });
        console.log('💓 Sent heartbeat event');
      }, 5000);
    },
    
    onDisconnect: () => {
      console.log('✗ Disconnected from real-time stream');
    },
    
    onError: (error) => {
      console.error('✗ Error:', error.message);
    },
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nDisconnecting...');
  client.disconnect();
  process.exit(0);
});

main();
