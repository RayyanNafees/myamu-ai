import { model, vector_index } from "@/utils/rag";
import { PromptTemplate } from "@langchain/core/prompts";
import type { BaseRetrieverInterface } from "@langchain/core/retrievers";
import type { APIRoute } from "astro";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import * as v from "valibot";

export const POST: APIRoute = async ({ request }) => {
	try {
		if (!vector_index.get()) {
			console.log("No Vector index defined", vector_index.get());
		}

		const data = v.safeParse(
			v.object({ question: v.string() }),
			await request.json(),
		);
		if (data.success === false) {
			return Response.json({ response: "Invalid request." }, {
				status: 400,
			});
		}
		const question = data.output.question;

		const template = `Use the following pieces of context to answer the question but if i ask something else related to this then also answer that. Always be kind after responding.
    {context}
    Question: {input}
    Helpful Answer:`;

		const QA_CHAIN_PROMPT = PromptTemplate.fromTemplate(template);

		const combineDocsChain = await createStuffDocumentsChain({
			llm: model,
			prompt: QA_CHAIN_PROMPT,
		});

		if (vector_index.get() === undefined) {
			return new Response(
				JSON.stringify({ error: "Vector index not created" }),
				{
					status: 500,
				},
			);
		}
		const qa_chain = await createRetrievalChain({
			retriever: vector_index.get() as BaseRetrieverInterface<
				// biome-ignore lint/suspicious/noExplicitAny: required by langchain
				Record<string, any>
			>,
			combineDocsChain,
		});
		if (!question)
			return new Response(
				JSON.stringify({ response: "No question provided." }),
				{
					status: 400,
				},
			);

		if (!qa_chain)
			return new Response(
				JSON.stringify({ response: "No PDF file uploaded." }),
				{
					status: 400,
				},
			);

		const result = await qa_chain.invoke({ input: question });
		return new Response(result.answer as string);
	} catch (e) {
		console.error('Error: ',e);
		return new Response(`${e}`, { status: 500 });
	}
};
