import { processPDF, processText } from './document-processor';
import { Document } from '@langchain/core/documents';

/**
 * Process uploaded files and store their embeddings in MongoDB
 * @param files Array of files to process
 * @param metadata Additional metadata to attach to the documents
 * @returns Array of processed documents
 */
export async function processUploadedFiles(
  files: File[],
  metadata: Record<string, unknown> = {}
): Promise<Document[]> {
  const processedDocs: Document[] = [];
  
  for (const file of files) {
    try {
      // Convert File to Buffer
      const buffer = await file.arrayBuffer().then(ab => Buffer.from(ab));
      
      // Process based on file type
      if (file.type === 'application/pdf') {
        const docs = await processPDF(buffer, {
          ...metadata,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString()
        });
        processedDocs.push(...docs);
      } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
        // For text files, read the content
        const text = await file.text();
        const docs = await processText(text, {
          ...metadata,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString()
        });
        processedDocs.push(...docs);
      } else {
        console.warn(`Unsupported file type: ${file.type} for file ${file.name}`);
      }
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }
  
  return processedDocs;
} 