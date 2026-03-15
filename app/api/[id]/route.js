import { prisma } from "@/lib/prisma"

export async function GET(req, { params }) {
  const resolvedParams = await params
  const id = Number(resolvedParams?.id)

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Invalid template id" }, { status: 400 })
  }

  const template = await prisma.template.findUnique({
    where: {
      id
    }
  })

  if (!template) {
    return Response.json({ error: "Template not found" }, { status: 404 })
  }

  return Response.json(template)
}