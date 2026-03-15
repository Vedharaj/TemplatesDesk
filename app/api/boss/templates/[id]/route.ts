import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBossTokenName, verifyBossToken } from "@/lib/bossAuth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function parseId(value: string | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  const token = req.cookies.get(getBossTokenName())?.value;
  if (!verifyBossToken(token)) {
    return unauthorized();
  }

  const resolved = await params;
  const id = parseId(resolved?.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  const token = req.cookies.get(getBossTokenName())?.value;
  if (!verifyBossToken(token)) {
    return unauthorized();
  }

  const resolved = await params;
  const id = parseId(resolved?.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
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

  const existing = await prisma.template.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const template = await prisma.template.update({
    where: { id },
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
      downloads: Math.max(parseNumber(body?.downloads, 0), 0),
      price: Math.max(parseNumber(body?.price, 0), 0),
      featured: Boolean(body?.featured),
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  const token = req.cookies.get(getBossTokenName())?.value;
  if (!verifyBossToken(token)) {
    return unauthorized();
  }

  const resolved = await params;
  const id = parseId(resolved?.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.template.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
