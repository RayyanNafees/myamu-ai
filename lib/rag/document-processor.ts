import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { GroqEmbeddings } from './groq-embeddings';
import { addDocuments } from './mongodb-store';

// Create embeddings model
const embeddings = new GroqEmbeddings();

export async function processPDF(file: Buffer, metadata: Record<string, any> = {}): Promise<Document[]> {
  const loader = new PDFLoader(file);
  const docs = await loader.load();
  
  // Add metadata to each document
  const docsWithMetadata = docs.map(doc => 
    new Document({
      pageContent: doc.pageContent,
      metadata: { ...doc.metadata, ...metadata }
    })
  );
  
  const splitDocs = await splitDocuments(docsWithMetadata);
  
  // Store in MongoDB
  await addDocuments(splitDocs, embeddings);
  
  return splitDocs;
}

export async function processText(text: string, metadata: Record<string, any> = {}): Promise<Document[]> {
  const doc = new Document({ 
    pageContent: text,
    metadata
  });
  
  const splitDocs = await splitDocuments([doc]);
  
  // Store in MongoDB
  await addDocuments(splitDocs, embeddings);
  
  return splitDocs;
}

async function splitDocuments(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return await textSplitter.splitDocuments(docs);
} 