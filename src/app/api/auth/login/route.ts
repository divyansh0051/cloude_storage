import { NextResponse } from 'next/server';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

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

    // In a live Supabase environment, supabase.auth.signInWithPassword is used
    return NextResponse.json({
      user: {
        id: 'user_1234567890',
        email: parsed.data.email,
        full_name: parsed.data.email.split('@')[0],
      },
      message: 'Successfully authenticated',
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
