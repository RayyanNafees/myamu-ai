import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/models/User.model";
// import { loginUserAction } from "@/actions/login";
// import { Loader2 } from "lucide-react";
// import { loginUserAction } from "@/app/actions";
import { cookies } from "next/headers";
import { fetchUserFromEnroll, getUserFromEnroll } from "@/lib/pdf";
import { redirect } from "next/navigation";
import type { UserType } from "@/types/user";
import { getCourseIcons } from "@/lib/gemini";
import iconNames from "@/data/iconNames.json";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	async function loginUserAction(formData: FormData) {
		"use server";
		const enroll = formData.get("enroll") as string;
		console.log({ enroll });
		const cookieStore = await cookies();
		const b = cookieStore.set("enroll", enroll);

		const loggedUser = await User.findOne({ enrollment: enroll });
		if (loggedUser) {
			redirect("/dashboard");
		}

		const user = (await fetchUserFromEnroll(enroll)) as UserType;
		const subjectNames = user.subjects.map((s) => s.subject);
		if (subjectNames.length) {
			const subjectIcons = await getCourseIcons(subjectNames, iconNames);
			console.log({ subjectNames, subjectIcons });
			const iconnedUser = {
				...user,
				subjects: user.subjects.map((s) => ({
					...s,
					iconName: subjectIcons[s.subject],
				})),
			};
			const currentUser = await new User(iconnedUser);
			await currentUser.save();
			console.log({ userId: currentUser._id });
			cookieStore.set("userId", currentUser._id);
			redirect("/dashboard");
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			{/* <Meteors className="-z-[1000]" /> */}

			<Card className="z-50">
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Login with your AMU enrollment number
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={loginUserAction}>
						<div className="grid gap-6">
							<div className="grid gap-6">
								<div className="grid gap-3">
									<Label htmlFor="enroll">Enrollment Number</Label>
									<Input
										id="enroll"
										type="text"
										name="enroll"
										placeholder="GP4519"
										required
									/>
								</div>

								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
