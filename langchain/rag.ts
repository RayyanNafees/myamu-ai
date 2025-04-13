import { getMemoryVectorStore } from "./pg-vector";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
	// GoogleGenerativeAIEmbeddings,
	ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { atom } from "nanostores";
import type { BaseRetrieverInterface } from "@langchain/core/retrievers";

export const vector_index = atom<
	// biome-ignore lint/suspicious/noExplicitAny: required by @langchain/google-gen-ai
	BaseRetrieverInterface<Record<string, any>> | undefined
>();
export const context = atom<string>("");

export const model = new ChatGoogleGenerativeAI({
	model: "gemini-2.0-flash",
	temperature: 0.2,
	apiKey: process.env.GEMINI_API_KEY,
});

export const process_pdf = async (file_path: File) => {
	const pdf_loader = new PDFLoader(file_path, { splitPages: true });
	const pages = await pdf_loader.load();
	console.log("Page length:", pages.length);

	console.log("Page Content: ", pages[0].pageContent);

	const text_splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 10_000,
		chunkOverlap: 1000,
	});

	const contents = pages.map((p) => p.pageContent).join("\n\n");
	const texts = await text_splitter.splitText(contents);

	const vectorStore = await getMemoryVectorStore(texts);

	// pgvector.addDocuments(
	//   pages

	//   // .map((t, n) => ({
	//   //   id: pages?.[n]?.id || crypto.randomUUID(),
	//   //   metadata: pages?.[n]?.metadata || {},
	//   //   pageContent: t,
	//   // })),
	// );
	vector_index.set(vectorStore.asRetriever({ k: 6 }));
	context.set(contents);

	return [vector_index.get(), contents];
};
