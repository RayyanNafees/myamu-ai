"use server";
import { User } from "@/models/User.model";
import { cookies } from "next/headers";

export const getUser = async () => {
	const cookieStore = await cookies();
	const enroll = cookieStore.get("enroll")?.value;
	const user = await User.findOne({ enrollment: enroll });
	return user;
};
