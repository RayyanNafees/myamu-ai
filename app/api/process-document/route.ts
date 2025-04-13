import { NextRequest, NextResponse } from 'next/server';
import { processUploadedFiles } from '@/lib/rag/upload-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const metadata = JSON.parse(formData.get('metadata') as string || '{}');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }
    
    // Process the files and store embeddings in MongoDB
    const processedDocs = await processUploadedFiles(files, metadata);
    
    return NextResponse.json({
      success: true,
      message: `Processed ${processedDocs.length} document chunks`,
      documentCount: processedDocs.length
    });
  } catch (error) {
    console.error('Error processing documents:', error);
    return NextResponse.json(
      { error: 'Failed to process documents' },
      { status: 500 }
    );
  }
} 