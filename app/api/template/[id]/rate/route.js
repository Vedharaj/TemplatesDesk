import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams?.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid template id" }, { status: 400 });
    }

    const body = await req.json();
    const rating = Number(body?.rating);

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    await prisma.$executeRaw`
      UPDATE Template
      SET ratingTotal = ratingTotal + ${rating},
          ratingCount = ratingCount + 1,
          rating = (ratingTotal + ${rating}) / (ratingCount + 1)
      WHERE id = ${id}
    `;

    const updated = await prisma.template.findUnique({
      where: { id },
      select: { rating: true, ratingCount: true },
    });

    if (!updated) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      rating: updated.rating,
      ratingCount: updated.ratingCount,
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
