export async function GET(
	request: Request,
	{ params }: { params: Promise<{ username: string }> },
) {
	const { username } = await params;
	const faculty = await fetch(
		`https://api.amu.ac.in/api/v1/teaching-staff-details?lang=en&slug=${username}`,
	).then((r) => r.json());

	if (!faculty?.success) return new Response("Faculty Not found", {status:404});

	return Response.json(faculty.data);
}