import { prisma } from "@/lib/prisma"

export async function GET(req) {

  const { searchParams } = new URL(req.url)

  const category = searchParams.get("category")
  const style = searchParams.get("style")
  const color = searchParams.get("color")
  const search = searchParams.get("search")

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 12)

  const skip = (page - 1) * limit

  const where = {
    ...(category && { category }),
    ...(style && { style }),
    ...(color && { color }),
    ...(search && {
      title: {
        contains: search
      }
    })
  }

  const templates = await prisma.template.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdDate: "desc"
    }
  })

  const total = await prisma.template.count({ where })

  return Response.json({
    data: templates,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  })
}

export async function POST(req) {

  const data = await req.json()

  const template = await prisma.template.create({
    data: {
      title: data.title,
      description: data.description,
      images: data.images,
      tags: data.tags,
      totalSlides: data.totalSlides,
      canvaLink: data.canvaLink,
      pptLink: data.pptLink,
      slideLink: data.slideLink,
      category: data.category,
      style: data.style,
      color: data.color,
      createdBy: "admin"
    }
  })

  return Response.json(template)
}