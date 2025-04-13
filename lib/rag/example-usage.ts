import { processPDF, processText } from './document-processor';
import { queryRAG } from './rag-chain';

// Example of processing and adding a PDF document
export async function addPDFDocument(pdfBuffer: Buffer, metadata: Record<string, unknown> = {}) {
  return await processPDF(pdfBuffer, metadata);
}

// Example of processing and adding text content
export async function addTextDocument(text: string, metadata: Record<string, unknown> = {}) {
  return await processText(text, metadata);
}

// Example of querying the RAG system
export async function askQuestion(question: string, k: number = 4) {
  const answer = await queryRAG(question, k);
  return answer;
}

// Example usage:
/*
// Add a PDF document
const pdfBuffer = await fs.readFile('path/to/document.pdf');
await addPDFDocument(pdfBuffer, { 
  source: 'academic_paper',
  author: 'John Doe',
  year: 2023
});

// Add text content
const textContent = "This is some text content to be added to the knowledge base.";
await addTextDocument(textContent, {
  source: 'notes',
  category: 'general'
});

// Query the RAG system
const question = "What is the main topic of the document?";
const answer = await askQuestion(question);
console.log(answer);
*/ 