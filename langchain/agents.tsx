
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

const getCurrentTime = () => {
	return new Date().toLocaleTimeString();
};

function search_wikipedia(query: string) {
	try {
		return summary(query, false).then((r) => r.extract);
	} catch (e) {
		return "couldnt find info on that";
	}
}

const tools = [
	tool(getCurrentTime, {
		name: "Time",
		description: "Useful for when you need to know the current time.",
	}),
	tool(search_wikipedia, {
		name: "Wikipedia",
		description: "Useful for when you need to know information about a topic.",
	}),
];
const _prompt = await hub.pull<ChatPromptTemplate>(
	"hwchase17/structured-chat-agent",
);
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
