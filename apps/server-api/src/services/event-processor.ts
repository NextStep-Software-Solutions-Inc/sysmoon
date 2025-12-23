import { prisma } from '../lib/prisma';
import { realTimeService } from './realtime';

export interface EventData {
  systemId: string;
  eventType: string;
  payload: any;
  severity?: string;
}

class EventProcessor {
  async processEvent(eventData: EventData) {
    // Enrich event data
    const enrichedEvent = {
      ...eventData,
      severity: eventData.severity || 'info',
      timestamp: new Date(),
    };

    // Persist to database
    const event = await prisma.event.create({
      data: {
        systemId: enrichedEvent.systemId,
        eventType: enrichedEvent.eventType,
        payload: enrichedEvent.payload,
        severity: enrichedEvent.severity,
        processed: true,
      },
      include: {
        system: {
          select: {
            name: true,
          },
        },
      },
    });

    // Broadcast to connected clients in real-time
    realTimeService.broadcastEvent({
      id: event.id,
      systemId: event.systemId,
      systemName: event.system.name,
      eventType: event.eventType,
      payload: event.payload,
      severity: event.severity,
      timestamp: event.timestamp,
    });

    return event;
  }

  async processBatch(events: EventData[]) {
    return Promise.all(events.map(event => this.processEvent(event)));
  }
}

export const eventProcessor = new EventProcessor();
