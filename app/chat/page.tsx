import { TreePalmIcon } from "lucide-react";
// import { OnboardingForm } from "@/components/onboarding-form";
import ChatInterface from '@/components/chat-interface'

export default function ChatPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<ChatInterface />
		</div>
	);
}
