import { PineconeClient } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('Missing PINECONE_API_KEY environment variable');
}

if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error('Missing PINECONE_ENVIRONMENT environment variable');
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('Missing PINECONE_INDEX_NAME environment variable');
}

const pinecone = new PineconeClient();
await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex }
);

export const retriever = vectorStore.asRetriever({
  k: 4, // Number of documents to retrieve
});

export async function addDocuments(documents: Document[]) {
  await vectorStore.addDocuments(documents);
}

export async function similaritySearch(query: string, k: number = 4) {
  return await vectorStore.similaritySearch(query, k);
} 