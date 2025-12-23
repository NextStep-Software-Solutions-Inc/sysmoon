// Example: Basic event sending with JavaScript SDK
import SysmoonClient from '@sysmoon/sdk-js';

const client = new SysmoonClient({
  apiUrl: 'http://localhost:3001',
});

async function main() {
  try {
    // Register a new system
    console.log('Registering system...');
    const registration = await client.register(
      'Example Node.js App',
      'Demo application for Sysmoon'
    );
    
    console.log('✓ System registered successfully!');
    console.log(`  System ID: ${registration.systemId}`);
    console.log(`  API Key: ${registration.apiKey}`);
    console.log('  ⚠️  Save the API key - you won\'t see it again!\n');
    
    // Send some example events
    console.log('Sending events...');
    
    await client.sendEvent({
      eventType: 'app.started',
      payload: {
        version: '1.0.0',
        environment: 'development',
        timestamp: new Date().toISOString(),
      },
      severity: 'info',
    });
    console.log('✓ Sent: app.started');
    
    await client.sendEvent({
      eventType: 'user.login',
      payload: {
        userId: 'user123',
        username: 'johndoe',
        ip: '192.168.1.100',
      },
      severity: 'info',
    });
    console.log('✓ Sent: user.login');
    
    // Send batch events
    await client.sendEvents([
      {
        eventType: 'database.query',
        payload: { query: 'SELECT * FROM users', duration: 45 },
        severity: 'info',
      },
      {
        eventType: 'api.request',
        payload: { endpoint: '/api/users', method: 'GET', status: 200 },
        severity: 'info',
      },
    ]);
    console.log('✓ Sent: 2 batch events');
    
    // Demonstrate error event
    await client.sendEvent({
      eventType: 'error.database',
      payload: {
        error: 'Connection timeout',
        query: 'SELECT * FROM orders',
        duration: 5000,
      },
      severity: 'error',
    });
    console.log('✓ Sent: error.database\n');
    
    console.log('All events sent successfully!');
    console.log('Check the dashboard at http://localhost:3000 to see them.');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
