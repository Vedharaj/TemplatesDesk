import { prisma } from "@/lib/prisma"

export async function GET(req, { params }) {

  const id = Number(params.id)

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