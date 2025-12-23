import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { createApiResponse } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  try {
    const systems = await prisma.system.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: {
          select: { events: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(
      createApiResponse(true, {
        systems: systems.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          createdAt: s.createdAt,
          eventCount: s._count.events,
        })),
      })
    );
  } catch (error) {
    console.error('Systems fetch error:', error);
    return res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}
