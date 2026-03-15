import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req) {

  try {

    const { searchParams } = new URL(req.url)

    const category = searchParams.get("category")
    const style = searchParams.get("style")
    const color = searchParams.get("color")
    const search = searchParams.get("search")
    const tag = searchParams.get("tag")
    const sort = searchParams.get("sort") || "new"

    const page = Math.max(Number(searchParams.get("page") || 1), 1)
    const limit = Math.min(Number(searchParams.get("limit") || 12), 50)

    const skip = (page - 1) * limit

    const where = {}

    if (category) where.category = category
    if (style) where.style = style
    if (color) where.color = color

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    }

    if (tag) {
      where.tags = {
        array_contains: [tag]
      }
    }

    let orderBy = { createdDate: "desc" }

    if (sort === "popular") {
      orderBy = { downloads: "desc" }
    }

    if (sort === "liked") {
      orderBy = { likes: "desc" }
    }

    if (sort === "views") {
      orderBy = { views: "desc" }
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: limit,
        orderBy
      }),
      prisma.template.count({ where })
    ])

    return NextResponse.json({
      data: templates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    )
  }
}

export async function POST(req) {

  try {

    const data = await req.json()

    if (!data.title || !data.category || !data.style) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const template = await prisma.template.create({
      data: {
        title: data.title,
        description: data.description || null,
        images: data.images || [],
        tags: data.tags || [],
        totalSlides: data.totalSlides || 0,
        canvaLink: data.canvaLink || "",
        pptLink: data.pptLink || "",
        slideLink: data.slideLink || "",
        category: data.category,
        style: data.style,
        color: data.color || null,
        createdBy: "admin"
      }
    })

    return NextResponse.json(template)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    )
  }
}