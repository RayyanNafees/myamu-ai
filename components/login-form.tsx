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
import { Meteors } from "@/components/magicui/meteors";
import { User } from "@/models/User.model";
// import { loginUserAction } from "@/actions/login";
// import { Loader2 } from "lucide-react";
// import { loginUserAction } from "@/app/actions";
import { cookies } from "next/headers";
import { fetchUserFromEnroll, getUserFromEnroll } from "@/lib/pdf";
import { redirect } from "next/navigation";
import type { UserType } from "@/types/user";
import { getCourseIcons } from "@/lib/gemini";
import iconNames from '@/data/iconNames.json'

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

		const loggedUser = await User.findOne({ enrollment: enroll })
		if (loggedUser) {
			redirect('/dashboard')
		}

		const user = await fetchUserFromEnroll(enroll) as UserType;
		const subjectNames = user.subjects.map(s => s.subject)
		if (subjectNames.length) {
			const subjectIcons = await getCourseIcons(subjectNames, iconNames)
			console.log({subjectNames, subjectIcons})
			const iconnedUser = { ...user, subjects: user.subjects.map(s => ({ ...s, iconName: subjectIcons[s.subject] })) }
			const currentUser = await new User(iconnedUser)
			await currentUser.save()
			console.log({ userId: currentUser._id })
			cookieStore.set('userId', currentUser._id)
			redirect('/dashboard');
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>

			<Meteors className="-z-[1000]" />

			<Card className="z-50">
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Login with your email associated with college
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={loginUserAction}>
						<div className="grid gap-6">
							<div className="flex flex-col gap-4">
								<Button variant="outline" className="w-full">
									<title>Google</title>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<title>Google</title>

										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Login with Google
								</Button>
							</div>
							<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
								<span className="bg-card text-muted-foreground relative z-10 px-2">
									Or continue with
								</span>
							</div>
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
								{/* <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div> */}
								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
							{/* <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div> */}
						</div>
					</form>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our{" "}
				<a href="/tnc">Terms of Service</a> and{" "}
				<a href="/privacy">Privacy Policy</a>.
			</div>
		</div>
	);
}
