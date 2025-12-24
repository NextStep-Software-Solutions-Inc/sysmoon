/**
 * Demo E-Commerce Application
 * 
 * This is a dummy 3rd party application that simulates an e-commerce
 * platform and uses the Sysmoon SDK to send monitoring events.
 * 
 * Features demonstrated:
 * - System registration
 * - Various event types (orders, payments, errors)
 * - Different severity levels
 * - Event sending to backend
 * - Continuous monitoring
 */

import express from 'express';
import SysmoonClient from '@sysmoon/sdk-js';

const app = express();
app.use(express.json());

// Configuration
const SYSMOON_API_URL = process.env.SYSMOON_API_URL || 'http://localhost:3000';
const SYSMOON_API_KEY = process.env.SYSMOON_API_KEY;
const PORT = process.env.PORT || 4000;

// Validate required environment variables
if (!SYSMOON_API_KEY) {
  console.error('❌ Error: SYSMOON_API_KEY environment variable is required');
  console.error('');
  console.error('Please register your system in the Sysmoon dashboard:');
  console.error(`  1. Navigate to ${SYSMOON_API_URL}/systems`);
  console.error('  2. Click "Register New System"');
  console.error('  3. Copy the generated API key');
  console.error('  4. Set the environment variable:');
  console.error('     export SYSMOON_API_KEY="your-api-key-here"');
  console.error('');
  process.exit(1);
}

// Initialize Sysmoon client with API key
const sysmoon = new SysmoonClient({
  apiUrl: SYSMOON_API_URL,
  apiKey: SYSMOON_API_KEY,
});

// Store for demo data
const orders = [];
let orderCounter = 1;

/**
 * Initialize the monitoring system
 */
async function initializeMonitoring() {
  try {
    console.log('🚀 E-Commerce Demo App - Initializing...\n');
    console.log(`📊 Connected to Sysmoon at ${SYSMOON_API_URL}`);
    console.log(`🔑 Using API Key: ${SYSMOON_API_KEY.substring(0, 8)}...`);
    console.log('');
    
    // Send startup event
    await sysmoon.sendEvent({
      eventType: 'app.started',
      payload: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        timestamp: new Date().toISOString(),
      },
      severity: 'info',
    });
    
    console.log('✅ Startup event sent successfully\n');
    
  } catch (error) {
    console.error('❌ Failed to initialize monitoring:', error.message);
    console.error('   Please check your API key and Sysmoon server status\n');
    process.exit(1);
  }
}

/**
 * API Routes - Each route sends monitoring events
 */

// Health check endpoint
app.get('/health', async (req, res) => {
  await sysmoon.sendEvent({
    eventType: 'health.check',
    payload: {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
    severity: 'info',
  });
  
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Create order endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customerId, total } = req.body;
    
    // Validate request
    if (!items || !customerId || !total) {
      await sysmoon.sendEvent({
        eventType: 'order.validation_failed',
        payload: {
          reason: 'Missing required fields',
          received: req.body,
        },
        severity: 'warning',
      });
      
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create order
    const order = {
      id: orderCounter++,
      customerId,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    orders.push(order);
    
    // Send order created event
    await sysmoon.sendEvent({
      eventType: 'order.created',
      payload: {
        orderId: order.id,
        customerId: order.customerId,
        itemCount: items.length,
        total: order.total,
        timestamp: order.createdAt,
      },
      severity: 'info',
    });
    
    console.log(`📦 Order #${order.id} created - Total: $${total}`);
    
    res.status(201).json(order);
  } catch (error) {
    await sysmoon.sendEvent({
      eventType: 'order.creation_failed',
      payload: {
        error: error.message,
        stack: error.stack,
      },
      severity: 'error',
    });
    
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Process payment endpoint
app.post('/api/payments', async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    
    // Simulate payment processing
    const success = Math.random() > 0.2; // 80% success rate
    
    if (success) {
      await sysmoon.sendEvent({
        eventType: 'payment.processed',
        payload: {
          orderId,
          amount,
          method,
          transactionId: `txn_${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        severity: 'info',
      });
      
      console.log(`💳 Payment processed - Order #${orderId}: $${amount}`);
      
      res.json({ success: true, transactionId: `txn_${Date.now()}` });
    } else {
      await sysmoon.sendEvent({
        eventType: 'payment.failed',
        payload: {
          orderId,
          amount,
          method,
          reason: 'Payment gateway timeout',
          timestamp: new Date().toISOString(),
        },
        severity: 'error',
      });
      
      console.log(`❌ Payment failed - Order #${orderId}`);
      
      res.status(402).json({ success: false, error: 'Payment failed' });
    }
  } catch (error) {
    await sysmoon.sendEvent({
      eventType: 'payment.error',
      payload: {
        error: error.message,
        stack: error.stack,
      },
      severity: 'critical',
    });
    
    res.status(500).json({ error: 'Payment processing error' });
  }
});

// Get orders endpoint
app.get('/api/orders', async (req, res) => {
  await sysmoon.sendEvent({
    eventType: 'orders.listed',
    payload: {
      count: orders.length,
      timestamp: new Date().toISOString(),
    },
    severity: 'info',
  });
  
  res.json(orders);
});

// Simulate some background activity
function simulateActivity() {
  setInterval(async () => {
    // Randomly generate events
    const eventTypes = [
      {
        type: 'user.browsing',
        payload: { page: '/products', sessionId: `session_${Math.random()}` },
        severity: 'info',
      },
      {
        type: 'inventory.check',
        payload: { itemsInStock: Math.floor(Math.random() * 1000) },
        severity: 'info',
      },
      {
        type: 'cache.hit',
        payload: { key: 'product_list', hitRate: Math.random() },
        severity: 'info',
      },
    ];
    
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    try {
      await sysmoon.sendEvent({
        eventType: randomEvent.type,
        payload: randomEvent.payload,
        severity: randomEvent.severity,
      });
    } catch (error) {
      // Silently fail for background events
    }
  }, 10000); // Every 10 seconds
}

// Start the server
async function start() {
  await initializeMonitoring();
  
  app.listen(PORT, () => {
    console.log(`🛍️  E-Commerce Demo App running on http://localhost:${PORT}`);
    console.log(`📊 Monitoring dashboard: ${SYSMOON_API_URL}/dashboard\n`);
    console.log('Available endpoints:');
    console.log(`  GET  http://localhost:${PORT}/health`);
    console.log(`  POST http://localhost:${PORT}/api/orders`);
    console.log(`  POST http://localhost:${PORT}/api/payments`);
    console.log(`  GET  http://localhost:${PORT}/api/orders\n`);
    console.log('Try it out:');
    console.log(`  curl -X POST http://localhost:${PORT}/api/orders \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"customerId":"cust123","items":["item1","item2"],"total":99.99}'\n`);
    
    // Start background activity simulation
    simulateActivity();
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down...');
  
  try {
    await sysmoon.sendEvent({
      eventType: 'app.shutdown',
      payload: {
        reason: 'SIGINT received',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      severity: 'info',
    });
  } catch (error) {
    // Ignore errors during shutdown
  }
  
  process.exit(0);
});

// Start the application
start().catch(console.error);
