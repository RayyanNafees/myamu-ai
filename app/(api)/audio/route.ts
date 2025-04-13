import { tts } from "@/lib/tts";

export const GET = async (req: Request) => {
	const text = new URL(req.url).searchParams.get("text") ?? "";
	const blob = await tts(text);
	return new Response(blob, { headers: { "Content-Type": "audio/wav" } });
};