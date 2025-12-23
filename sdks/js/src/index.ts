import { io, Socket } from 'socket.io-client';

export interface SysmoonConfig {
  apiUrl: string;
  apiKey?: string;
  systemName?: string;
  systemDescription?: string;
}

export interface EventData {
  eventType: string;
  payload: any;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

export interface RegistrationResponse {
  systemId: string;
  apiKey: string;
  name: string;
}

export class SysmoonClient {
  private config: SysmoonConfig;
  private socket: Socket | null = null;

  constructor(config: SysmoonConfig) {
    this.config = config;
  }

  /**
   * Register a new system with Sysmoon
   */
  async register(name?: string, description?: string): Promise<RegistrationResponse> {
    const response = await fetch(`${this.config.apiUrl}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name || this.config.systemName || 'Unnamed System',
        description: description || this.config.systemDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Registration failed');
    }

    // Store API key for future requests
    this.config.apiKey = result.data.apiKey;

    return result.data;
  }

  /**
   * Send a single event to Sysmoon
   */
  async sendEvent(event: EventData): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('API key not set. Please register first or provide an API key.');
    }

    const response = await fetch(`${this.config.apiUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Failed to send event: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send event');
    }
  }

  /**
   * Send multiple events in a batch
   */
  async sendEvents(events: EventData[]): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('API key not set. Please register first or provide an API key.');
    }

    const response = await fetch(`${this.config.apiUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
      },
      body: JSON.stringify(events),
    });

    if (!response.ok) {
      throw new Error(`Failed to send events: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send events');
    }
  }

  /**
   * Connect to real-time event stream via WebSocket
   */
  connectRealTime(options?: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
  }): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const socketUrl = this.config.apiUrl.replace(/^http/, 'ws');
    
    this.socket = io(socketUrl, {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
    });

    if (options?.onConnect) {
      this.socket.on('connect', options.onConnect);
    }

    if (options?.onDisconnect) {
      this.socket.on('disconnect', options.onDisconnect);
    }

    if (options?.onError) {
      this.socket.on('error', (err) => options.onError!(new Error(err)));
    }

    return this.socket;
  }

  /**
   * Subscribe to specific events via WebSocket
   */
  subscribe(filter: {
    systemId?: string;
    eventType?: string;
    severity?: string[];
  }, callback: (event: any) => void): void {
    if (!this.socket || !this.socket.connected) {
      throw new Error('Not connected to real-time stream. Call connectRealTime() first.');
    }

    this.socket.emit('subscribe', filter);
    this.socket.on('event', callback);
  }

  /**
   * Disconnect from real-time stream
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Set API key manually
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }
}

export default SysmoonClient;
