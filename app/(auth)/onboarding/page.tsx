import { TreePalmIcon } from "lucide-react";
import { OnboardingForm } from "@/components/onboarding-form";
import type { NextRequest } from "next/server";

export default function LoginPage({url}: NextRequest) {
	// try {
	// 	const query = new URL(request.url).searchParams.get("enroll");
	// 	console.log({ query });
	// } catch (e) {}
  console.log({url})
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="/" className="flex items-center gap-2 self-center font-medium">
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<TreePalmIcon className="size-4" />
					</div>
					MyAMU AI
				</a>
				<OnboardingForm />
			</div>
		</div>
	);
}
