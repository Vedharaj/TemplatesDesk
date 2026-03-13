import * as Store from "@/app/store/storeData";
import HeroCard from "@/components/HeroCard";
import FilterBtn from "@/components/FilterBtn";
import { cardDataList } from "@/app/store/storeData";
import PaginatedCards from "@/components/PaginatedCards";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      }
    | Promise<{
        page?: string;
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
  const totalPages = Math.max(1, Math.ceil(cardDataList.length / cardsPerPage));
  const rawPage = Number.parseInt(resolvedSearchParams?.page ?? "1", 10);
  const currentPage = Number.isNaN(rawPage)
    ? 1
    : Math.min(Math.max(rawPage, 1), totalPages);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedCards = cardDataList.slice(startIndex, startIndex + cardsPerPage);

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
          <FilterBtn />
        </div>
        <PaginatedCards cards={paginatedCards} />

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
      </div>
    </div>
  );
}
