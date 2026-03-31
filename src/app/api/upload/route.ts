import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Use the "file" field in multipart form data.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10 MB.' },
        { status: 400 }
      );
    }

    // In production, this would upload to Supabase Storage.
    // For now, return a mock URL.
    const fileExtension = file.name.split('.').pop() ?? 'jpg';
    const mockFileName = `${uuidv4()}.${fileExtension}`;
    const mockUrl = `https://storage.example.com/uploads/${mockFileName}`;

    return NextResponse.json(
      {
        url: mockUrl,
        fileName: mockFileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
