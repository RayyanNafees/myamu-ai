import { TreePalmIcon } from "lucide-react";
import { OnboardingForm } from "@/components/onboarding-form";
import type { NextRequest } from "next/server";
import ChatInterface from '@/components/chat-interface'
export default function LoginPage({url}: NextRequest) {
	// try {
	// 	const query = new URL(request.url).searchParams.get("enroll");
	// 	console.log({ query });
	// } catch (e) {}
  console.log({url})
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<ChatInterface />
		</div>
	);
}
