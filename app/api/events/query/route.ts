import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const systemId = searchParams.get('systemId');
    const eventType = searchParams.get('eventType');
    const severity = searchParams.get('severity');
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    const where: any = {};
    
    if (systemId) {
      where.systemId = systemId;
    }
    
    if (eventType) {
      where.eventType = eventType;
    }
    
    if (severity) {
      where.severity = { in: severity.split(',') };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        system: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.event.count({ where });

    return NextResponse.json(
      createApiResponse(true, {
        events: events.map((e: any) => ({
          id: e.id,
          systemId: e.systemId,
          systemName: e.system.name,
          eventType: e.eventType,
          payload: e.payload,
          severity: e.severity,
          timestamp: e.timestamp,
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      })
    );
  } catch (error) {
    console.error('Events query error:', error);
    return NextResponse.json(
      createApiResponse(false, null, 'Internal server error'),
      { status: 500 }
    );
  }
}
