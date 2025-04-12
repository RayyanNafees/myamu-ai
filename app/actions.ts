"use server";
import { getUserFromEnroll } from "@/lib/pdf";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUserAction(formData: FormData) {
	const enroll = formData.get("enroll") as string;
	console.log({enroll})
	const cookieStore = await cookies();
	const b = cookieStore.set("enroll", "1");
	const user = await getUserFromEnroll(enroll);
	console.log(user);
	redirect("/onboarding");
}
