import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, createApiResponse } from '@/lib/auth';
import { eventProcessor } from '@/services/event-processor';
import { z } from 'zod';

const eventSchema = z.object({
  eventType: z.string().min(1),
  payload: z.any(),
  severity: z.enum(['info', 'warning', 'error', 'critical']).optional(),
});

const eventBatchSchema = z.array(eventSchema);

async function handler(req: NextApiRequest, res: NextApiResponse, systemId: string) {
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  try {
    const isBatch = Array.isArray(req.body);
    
    if (isBatch) {
      const events = eventBatchSchema.parse(req.body);
      const eventsWithSystemId = events.map(event => ({
        ...event,
        systemId,
      }));
      
      const processedEvents = await eventProcessor.processBatch(eventsWithSystemId);
      
      return res.status(201).json(
        createApiResponse(true, {
          count: processedEvents.length,
          events: processedEvents.map(e => ({ id: e.id, timestamp: e.timestamp })),
        })
      );
    } else {
      const event = eventSchema.parse(req.body);
      const processedEvent = await eventProcessor.processEvent({
        ...event,
        systemId,
      });

      return res.status(201).json(
        createApiResponse(true, {
          eventId: processedEvent.id,
          timestamp: processedEvent.timestamp,
        })
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createApiResponse(false, null, error.errors[0].message));
    }

    console.error('Event ingestion error:', error);
    return res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}

export default withAuth(handler);
