import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
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

    return NextResponse.json(
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
    return NextResponse.json(
      createApiResponse(false, null, 'Internal server error'),
      { status: 500 }
    );
  }
}
