import { Documents } from "@/models/Documents.model";
// import { User } from "@/models/User.model";

export const POST = async (req: Request) => {
	const documents = await req.json();
	// const user = await User.findOne({ _id: userId });
	// if (!user) return new Response("User not found", { status: 404 });
	const docs = await Documents.insertMany(
		documents.map((i: { date: string }) => ({
			...i,
			date: new Date(i.date),
		})),
	);
  
	return Response.json(docs);
};
