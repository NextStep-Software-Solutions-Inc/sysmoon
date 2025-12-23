import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { createApiResponse } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(createApiResponse(false, null, 'Method not allowed'));
  }

  try {
    const body = registerSchema.parse(req.body);

    const system = await prisma.system.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });

    return res.status(201).json(
      createApiResponse(true, {
        systemId: system.id,
        apiKey: system.apiKey,
        name: system.name,
        message: 'System registered successfully. Keep your API key secure!',
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createApiResponse(false, null, error.errors[0].message));
    }

    console.error('Registration error:', error);
    return res.status(500).json(createApiResponse(false, null, 'Internal server error'));
  }
}
