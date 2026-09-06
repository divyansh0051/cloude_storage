import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  parentId: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateFolderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message || 'Invalid folder parameters',
          },
        },
        { status: 400 }
      );
    }

    const newFolder = {
      id: `folder_${Date.now()}`,
      name: parsed.data.name,
      parent_id: parsed.data.parentId || null,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ folder: newFolder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error?.message || 'Failed to create folder',
        },
      },
      { status: 500 }
    );
  }
}
