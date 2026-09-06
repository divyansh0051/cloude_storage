import { NextResponse } from 'next/server';
import { z } from 'zod';

const FileInitSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string(),
  sizeBytes: z.number().positive(),
  folderId: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = FileInitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message || 'Invalid upload initialization payload',
          },
        },
        { status: 400 }
      );
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const storageKey = `tenants/user_1234567890/folders/${parsed.data.folderId || 'root'}/files/${fileId}-${parsed.data.filename}`;

    return NextResponse.json({
      fileId,
      storageKey,
      uploadUrl: `https://example.supabase.co/storage/v1/object/upload/sign/${storageKey}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error?.message || 'Failed to initialize file upload',
        },
      },
      { status: 500 }
    );
  }
}
