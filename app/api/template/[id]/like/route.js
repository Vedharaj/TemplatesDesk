import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function parseTemplateId(params) {
  const resolvedParams = await params;
  const id = Number(resolvedParams?.id);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function POST(_req, { params }) {
  try {
    const id = await parseTemplateId(params);

    if (!id) {
      return NextResponse.json({ error: "Invalid template id" }, { status: 400 });
    }

    const updated = await prisma.template.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });

    return NextResponse.json({ success: true, likes: updated.likes });
  } catch {
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const id = await parseTemplateId(params);

    if (!id) {
      return NextResponse.json({ error: "Invalid template id" }, { status: 400 });
    }

    await prisma.template.updateMany({
      where: { id, likes: { gt: 0 } },
      data: { likes: { decrement: 1 } },
    });

    const updated = await prisma.template.findUnique({
      where: { id },
      select: { likes: true },
    });

    if (!updated) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes: updated.likes });
  } catch {
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}
