import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { createApiResponse } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  try {
    const { systemId, eventType, severity, limit = '100', offset = '0' } = req.query;

    const where: any = {};
    
    if (systemId && typeof systemId === 'string') {
      where.systemId = systemId;
    }
    
    if (eventType && typeof eventType === 'string') {
      where.eventType = eventType;
    }
    
    if (severity && typeof severity === 'string') {
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
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.event.count({ where });

    return res.status(200).json(
      createApiResponse(true, {
        events: events.map(e => ({
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
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      })
    );
  } catch (error) {
    console.error('Events query error:', error);
    return res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}
