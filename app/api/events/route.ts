import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, createApiResponse } from '@/lib/auth';
import { eventProcessor } from '@/lib/services/event-processor';
import { z } from 'zod';

const eventSchema = z.object({
  eventType: z.string().min(1),
  payload: z.any(),
  severity: z.enum(['info', 'warning', 'error', 'critical']).optional(),
});

const eventBatchSchema = z.array(eventSchema);

export async function POST(req: NextRequest) {
  try {
    // Authenticate request
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        createApiResponse(false, null, 'Unauthorized: Missing API key'),
        { status: 401 }
      );
    }

    const systemId = await authenticateRequest({ headers: { 'x-api-key': apiKey } } as any);
    if (!systemId) {
      return NextResponse.json(
        createApiResponse(false, null, 'Unauthorized: Invalid API key'),
        { status: 401 }
      );
    }

    const body = await req.json();
    const isBatch = Array.isArray(body);
    
    if (isBatch) {
      const events = eventBatchSchema.parse(body);
      const eventsWithSystemId = events.map(event => ({
        ...event,
        systemId,
      }));
      
      const processedEvents = await eventProcessor.processBatch(eventsWithSystemId);
      
      return NextResponse.json(
        createApiResponse(true, {
          count: processedEvents.length,
          events: processedEvents.map(e => ({ id: e.id, timestamp: e.timestamp })),
        }),
        { status: 201 }
      );
    } else {
      const event = eventSchema.parse(body);
      const processedEvent = await eventProcessor.processEvent({
        ...event,
        systemId,
      });

      return NextResponse.json(
        createApiResponse(true, {
          eventId: processedEvent.id,
          timestamp: processedEvent.timestamp,
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createApiResponse(false, null, error.errors[0].message),
        { status: 400 }
      );
    }

    console.error('Event ingestion error:', error);
    return NextResponse.json(
      createApiResponse(false, null, 'Internal server error'),
      { status: 500 }
    );
  }
}
