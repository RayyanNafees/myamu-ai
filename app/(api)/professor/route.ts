export async function GET(
	request: Request,
	
) { const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return new Response("slug query not provided", { status: 400 });
	const faculty = await fetch(
		`https://api.amu.ac.in/api/v1/teaching-staff-details?lang=en&slug=${slug}`,
	).then((r) => r.json());

	if (!faculty?.success) return new Response("Faculty Not found", {status:404});

	return Response.json(faculty.data);
}