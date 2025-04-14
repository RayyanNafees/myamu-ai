import { fetchTextFromPDF, fetchUserFromEnroll } from "@/lib/pdf";
import { tts } from "@/lib/tts";
import { Documents } from "@/models/Documents.model";
import { Buffer } from "node:buffer";

export const POST = async (req: Request) => {
	const doc = await req.json();
	if (!doc.id) return new Response("Invalid docId", { status: 400 });

	const docItem = await Documents.findById(doc.id);
	const docFile = await fetch(docItem.url).then((r) => r.arrayBuffer());
	const docBuffer = Buffer.from(docFile);
	const text = await fetchTextFromPDF(docFile).then((r) => r.slice(0, 200));

	const blob = await tts(text.slice(0,20));
	const arrayBuffer = await blob.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = buffer.toString("base64");

	console.log({
		base64: base64.length,
		// doc,
		docName: doc.name,
		docCourse: doc.course,
		text: text.length,
	});
	return Response.json({
		base64,
		doc,
		docName: doc.name,
		docCourse: doc.course,
		text,
	});
};
