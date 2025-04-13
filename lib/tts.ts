import fs from "node:fs";
import path from "node:path";
import Groq from "groq-sdk";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

const speechFilePath = "speech.wav";
const model = "playai-tts";
const voice = "Fritz-PlayAI";
const defaultText = "I love building and shipping new features for our users!";
const responseFormat = "wav";

export async function tts(text = defaultText) {
	const response = await groq.audio.speech.create({
		model: model,
		voice: voice,
		input: text.slice(0, 10_000),
		response_format: responseFormat,
	});

	const buffer = Buffer.from(await response.arrayBuffer());
	buffer.toString("base64");
	const blob = new Blob([buffer], { type: "audio/wav" });
	return blob;
}
