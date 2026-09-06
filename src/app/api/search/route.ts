import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase() || '';

    return NextResponse.json({
      query: q,
      results: {
        folders: [],
        files: [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error?.message || 'Search failed',
        },
      },
      { status: 500 }
    );
  }
}
