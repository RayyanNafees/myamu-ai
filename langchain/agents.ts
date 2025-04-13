import * as hub from "langchain/hub";
import {
	AgentExecutor,
	createReactAgent,
	createStructuredChatAgent,
} from "langchain/agents";
import { ConversationSummaryBufferMemory } from "langchain/memory";
import {
	HumanMessage,
	SystemMessage,
	AIMessage,
	type BaseMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { summary } from "wikipedia";
import type { ChatPromptTemplate } from "@langchain/core/prompts";

const tools = [
	tool(() => new Date().toLocaleTimeString(), {
		name: "Time",
		description: "Useful for when you need to know the current time.",
	}),
	tool(() => new Date().toLocaleTimeString(), {
		name: "Date",
		description: "Useful for when you need to know the current date.",
	}),
	tool(
		(query) =>
			fetch(`https://scheme.deno.dev/api/student/${query}`).then((r) =>
				r.text(),
			),
		{
			name: "Student Info from enrollment",
			description:
				"Useful knowing the student's information from his enrollment number. (enrollment number is of format 'GP4519')",
		},
	),
	tool(
		() =>
			fetch('https://opensheet.elk.sh/1ogjvUBuTRre5aZYh-GlN9p-KvVt9DUsBCUuUkepXFxQ/Complete').then((r) =>
				r.text(),
			),
		{
			name: "Student Info ",
			description:
				"Useful knowing the student's information with name, faculty, enrollment, hall, class, serial, branch, course, college etc",
		},
	),
	tool(
		(query: string) =>
			summary(query, false)
				.then((r) => r.extract)
				.catch(() => "couldnt find info on that"),
		{
			name: "Wikipedia",
			description:
				"Useful for when you need to know information about a topic.",
		},
	),
	tool(
		(query: string) =>
			fetch(`https://scheme.deno.dev?enroll=${query}`),
		{
			name: "Scheme/Datesheet of exam from enrollment number",
			description:
				"Useful for knowing the scheme/datesheet of examinations, its dates and times etc. from the provided enrollment numebr , eg 'GP4519'",
		},
	),

	tool(() => fetch("/departments").then((r) => r.json()), {
		name: "ZHCET Departments",
		description:
			"Tells about the slugs of all the departments at Zakir Hussain College of Engg & Tech at AMU. Usefull for fetching the faculty members & professors",
	}),
	tool((query: string) => fetch(`/faculties/${query}`).then((r) => r.json()), {
		name: "ZHCET Faculty & Professors",
		description:
			"Tells about the names of all the departments at Zakir Hussain College of Engg & Tech at AMU",
	}),
	tool((query) => fetch(`/professor?slug=${query}`).then((r) => r.json()), {
		name: "ZHCET Professor/Faculty Information",
		description:
			"Tells about the information of the professor based on his id/username/slug at Zakir Hussain College of Engg & Tech at AMU",
	}),
];
const _prompt = await hub.pull("hwchase17/structured-chat-agent");
const llm = new ChatGoogleGenerativeAI({
	model: "gemini-2.0-flash",
	maxOutputTokens: 2048,
	apiKey: process.env.GEMINI_API_KEY,
});

const memory = new ConversationSummaryBufferMemory({
	memoryKey: "chat_history",
	returnMessages: true,
	llm,
});

const agent = await createStructuredChatAgent({
	llm,
	tools,
	prompt: _prompt,
	// memory,
});
const agent_executor = AgentExecutor.fromAgentAndTools({
	tools,
	agent,
	verbose: true,
});

const chat_history: BaseMessage[] = [];

while (true) {
	const query = prompt("You: ") ?? "";
	if (query.toLowerCase() === "exit") {
		break;
	}
	chat_history.push(new HumanMessage({ content: query }));
	const result = await agent_executor.invoke({ input: query, chat_history });
	console.log(`AI: ${result.output}`);

	// Update history
	chat_history.push(new AIMessage({ content: result.output }));
}
