import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TaskType } from "@google/generative-ai";
const embeddings = new GoogleGenerativeAIEmbeddings({
	model: "text-embedding-004",
	apiKey: process.env.GEMINI_API_KEY,
	taskType: TaskType.RETRIEVAL_DOCUMENT,
});

export const getMemoryVectorStore = (texts: string[]) =>
	MemoryVectorStore.fromDocuments(
		texts.map((text) => ({ pageContent: text, metadata: {} })),
		embeddings,
	);
