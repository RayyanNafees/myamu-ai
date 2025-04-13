import { ChatOpenAI } from '@langchain/openai';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { GroqEmbeddings } from './groq-embeddings';
import { getVectorStore } from './mongodb-store';

// Create embeddings model
const embeddings = new GroqEmbeddings();

// Create a retriever
export async function getRetriever(k: number = 4) {
  const vectorStore = await getVectorStore(embeddings);
  return vectorStore.asRetriever(k);
}

const prompt = ChatPromptTemplate.fromTemplate(`
Answer the following question based on the provided context:

Context: {context}

Question: {question}

Answer the question based on the context provided. If you cannot answer the question based on the context, say "I cannot answer this question based on the provided context."
`);

// Use Groq for the LLM as well
const llm = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0,
});

// Create the document chain
export async function createDocumentChain() {
  return await createStuffDocumentsChain({
    llm,
    prompt,
  });
}

// Create the retrieval chain
export async function createRetrievalChainWithMongoDB(k: number = 4) {
  const retriever = await getRetriever(k);
  const documentChain = await createDocumentChain();
  
  return await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });
}

// Query the RAG system
export async function queryRAG(question: string, k: number = 4) {
  const chain = await createRetrievalChainWithMongoDB(k);
  const response = await chain.invoke({
    question,
  });
  
  return response.answer;
} 