import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './prisma';

export async function authenticateRequest(req: NextApiRequest): Promise<string | null> {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return null;
  }

  const system = await prisma.system.findUnique({
    where: { apiKey },
    select: { id: true },
  });

  return system?.id || null;
}

export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, systemId: string) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const systemId = await authenticateRequest(req);

    if (!systemId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
    }

    return handler(req, res, systemId);
  };
}

export function createApiResponse(success: boolean, data?: any, error?: string) {
  return {
    success,
    data: data || null,
    error: error || null,
    timestamp: new Date().toISOString(),
  };
}
