import { presignURL } from "@/lib/upload";
import { Upload } from "lucide-react";
import type { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
	const filename =
		new URL(req.url).searchParams.get("filename") ?? `${Date.now()}-file.txt`;
	const signed = await presignURL(filename);
	return new Response(signed.url);
};
