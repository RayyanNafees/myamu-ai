export const GET = async (req: Request) => {
	const department = new URL(req.url).searchParams.get("department");
	if (!department) return new Response("Department query not provided", { status: 400 });

	const faculties = await fetch(
		`https://api.amu.ac.in/api/v1/department-list-data?lang=en&slug=department/${department}/faculty-members`,
	).then((r) => r.json());

	if (!faculties?.success)
		return new Response("Department Not found", { status: 404 });
	return new Response(JSON.stringify(faculties.data.data));
};