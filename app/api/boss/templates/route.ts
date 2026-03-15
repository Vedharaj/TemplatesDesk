import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBossTokenName, verifyBossToken } from "@/lib/bossAuth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function parseNumber(value: unknown, fallback: number) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(getBossTokenName())?.value;
  if (!verifyBossToken(token)) {
    return unauthorized();
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseNumber(searchParams.get("page"), 1), 1);
  const limit = Math.max(parseNumber(searchParams.get("limit"), 20), 1);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category")?.trim();
  const style = searchParams.get("style")?.trim();
  const featured = searchParams.get("featured")?.trim();

  const where: Record<string, unknown> = {
    ...(search
      ? {
          title: {
            contains: search,
          },
        }
      : {}),
    ...(category ? { category } : {}),
    ...(style ? { style } : {}),
    ...(featured === "true" ? { featured: true } : {}),
    ...(featured === "false" ? { featured: false } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.template.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdDate: "desc" },
    }),
    prisma.template.count({ where }),
  ]);

  return NextResponse.json({
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(getBossTokenName())?.value;
  if (!verifyBossToken(token)) {
    return unauthorized();
  }

  const body = await req.json();

  const title = String(body?.title ?? "").trim();
  const category = String(body?.category ?? "").trim();
  const style = String(body?.style ?? "").trim();
  const canvaLink = String(body?.canvaLink ?? "").trim();
  const pptLink = String(body?.pptLink ?? "").trim();
  const slideLink = String(body?.slideLink ?? "").trim();

  if (!title || !category || !style || !canvaLink || !pptLink || !slideLink) {
    return NextResponse.json(
      { error: "title, category, style, canvaLink, pptLink and slideLink are required" },
      { status: 400 }
    );
  }

  const template = await prisma.template.create({
    data: {
      title,
      description: body?.description ? String(body.description) : null,
      images: parseStringArray(body?.images),
      tags: parseStringArray(body?.tags),
      totalSlides: Math.max(parseNumber(body?.totalSlides, 0), 0),
      canvaLink,
      pptLink,
      slideLink,
      category,
      style,
      color: body?.color ? String(body.color) : null,
      createdBy: "boss",
      downloads: Math.max(parseNumber(body?.downloads, 0), 0),
      price: Math.max(parseNumber(body?.price, 0), 0),
      featured: Boolean(body?.featured),
    },
  });

  return NextResponse.json(template, { status: 201 });
}
