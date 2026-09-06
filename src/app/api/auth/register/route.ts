import { NextResponse } from 'next/server';
import { z } from 'zod';

const RegisterSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message || 'Invalid input data',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: {
        id: `user_${Date.now()}`,
        email: parsed.data.email,
        full_name: parsed.data.fullName || parsed.data.email.split('@')[0],
      },
      message: 'Account created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error?.message || 'An unexpected error occurred.',
        },
      },
      { status: 500 }
    );
  }
}
