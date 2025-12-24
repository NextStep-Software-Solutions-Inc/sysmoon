import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiResponse } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const system = await prisma.system.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
    });

    return NextResponse.json(
      createApiResponse(true, {
        systemId: system.id,
        apiKey: system.apiKey,
        name: system.name,
        message: 'System registered successfully. Keep your API key secure!',
      }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createApiResponse(false, null, error.errors[0].message),
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      createApiResponse(false, null, 'Internal server error'),
      { status: 500 }
    );
  }
}
