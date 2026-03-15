import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req, { params }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams?.id);

    if (!Number.isInteger(id) || id <= 0) {
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
