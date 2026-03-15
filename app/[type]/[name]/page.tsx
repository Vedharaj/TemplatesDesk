import * as Store from "@/app/store/storeData";
import HeroCard from "@/components/HeroCard";
import FilterBtn from "@/components/FilterBtn";
import PaginatedCards from "@/components/PaginatedCards";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Template } from "@prisma/client";

interface PageProps {
  params:
    | {
        name?: string;
        type?: string;
      }
    | Promise<{
        name?: string;
        type?: string;
      }>;
  searchParams?:
    | {
        page?: string;
        category?: string;
        color?: string;
        style?: string;
      }
    | Promise<{
        page?: string;
        category?: string;
        color?: string;
        style?: string;
      }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { name, type } = resolvedParams;

  if (!name || !type) {
    notFound();
  }

  const decodedName = decodeURIComponent(name);

  const storeMap = {
    category: Store.Categories,
    categories: Store.Categories,
    color: Store.Colors,
    colors: Store.Colors,
    style: Store.Styles,
    styles: Store.Styles,
  } as const;

  const dataSource = storeMap[type.toLowerCase() as keyof typeof storeMap];
  const data = (
    dataSource as
      | Record<string, { title: string; subtitle: string }>
      | undefined
  )?.[decodedName];

  if (!data) {
    notFound();
  }

  const cardsPerPage = 9;
  const rawPage = Number.parseInt(resolvedSearchParams?.page ?? "1", 10);
  const safePage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const filterCategory = resolvedSearchParams?.category;
  const filterColor = resolvedSearchParams?.color;
  const filterStyle = resolvedSearchParams?.style;

  // Map route type to the Prisma where field
  const normalizedType = type.toLowerCase();
  const where: Record<string, string> = {};
  if (normalizedType === "category" || normalizedType === "categories") {
    where.category = decodedName;
    if (filterColor) where.color = filterColor;
    if (filterStyle) where.style = filterStyle;
  } else if (normalizedType === "color" || normalizedType === "colors") {
    where.color = decodedName;
    if (filterCategory) where.category = filterCategory;
    if (filterStyle) where.style = filterStyle;
  } else if (normalizedType === "style" || normalizedType === "styles") {
    where.style = decodedName;
    if (filterCategory) where.category = filterCategory;
    if (filterColor) where.color = filterColor;
  }

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      skip: (safePage - 1) * cardsPerPage,
      take: cardsPerPage,
      orderBy: { createdDate: "desc" },
    }),
    prisma.template.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / cardsPerPage));
  const currentPage = Math.min(safePage, totalPages);

  const paginatedCards = templates.map((t: Template) => ({
    id: t.id,
    title: t.title,
    rating: t.rating,
    downloads: String(t.downloads),
    tags: (t.tags as string[]).slice(0, 2),
    image: ((t.images as string[])[0]) ?? "/image/placeholder.png",
    price: t.price,
    canvaLink: t.canvaLink,
    pptLink: t.pptLink,
    slideLink: t.slideLink,
  }));

  const createPageHref = (page: number) =>
    `/${encodeURIComponent(type)}/${encodeURIComponent(name)}?page=${page}`;

  return (
    <div>
      <HeroCard title={data.title} subtitle={data.subtitle} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mt-4 w-full flex justify-between">
          <h3 className="text-2xl font-bold capitalize">
            {decodeURIComponent(name)}
          </h3>
          <FilterBtn
            key={`${type}-${name}`}
            categories={Object.keys(Store.Categories)}
            colors={Object.keys(Store.Colors)}
            styles={Object.keys(Store.Styles)}
            currentType={type}
          />
        </div>
        {paginatedCards.length > 0 ? (
          <PaginatedCards cards={paginatedCards} />
        ) : (
          <div className="mt-8 rounded-md border border-dashed border-gray-300 px-4 py-10 text-center text-gray-500">
            No result found.
          </div>
        )}

        {total > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={createPageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-muted"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Link
                key={page}
                href={createPageHref(page)}
                className={`rounded-md border px-3 py-1.5 text-sm transition ${
                  page === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {page}
              </Link>
            )
          )}

          <Link
            href={createPageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-muted"
            }`}
          >
            Next
          </Link>
          </div>
        )}
      </div>
    </div>
  );
}
