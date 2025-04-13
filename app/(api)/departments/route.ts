export const GET = async (req: Request) => {
  const departments = await fetch('https://api.amu.ac.in/api/v1/department-list?lang=en').then(r => r.json())
  if (!departments?.success) return new Response('Could not load departments', { status: 404 })

  return Response.json(departments.data)
}