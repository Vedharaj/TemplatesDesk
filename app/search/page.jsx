import Link from "next/link";
import { headers } from "next/headers";
import PaginatedCards from "@/components/PaginatedCards";

const cardsPerPage = 9;

async function fetchSearchResults(query, page) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const baseUrl = host
    ? `${protocol}://${host}`
    : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/templates?search=${encodeURIComponent(query)}&page=${page}&limit=${cardsPerPage}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        limit: cardsPerPage,
        pages: 1,
      },
    };
  }

  return response.json();
}

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q ?? "").trim();
  const rawPage = Number.parseInt(resolvedSearchParams?.page ?? "1", 10);
  const safePage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const result = query
    ? await fetchSearchResults(query, safePage)
    : {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: cardsPerPage,
          pages: 1,
        },
      };

  const templates = Array.isArray(result?.data) ? result.data : [];
  const total = Number(result?.pagination?.total ?? 0);
  const totalPages = Math.max(1, Number(result?.pagination?.pages ?? 1));
  const currentPage = Math.min(safePage, totalPages);

  const paginatedCards = templates.map((t) => ({
    id: t.id,
    title: t.title,
    rating: t.rating,
    downloads: String(t.downloads ?? 0),
    price: t.price,
    tags: Array.isArray(t.tags) ? t.tags.slice(0, 2) : [],
    image: Array.isArray(t.images) && t.images[0] ? t.images[0] : "/image/placeholder.png",
    canvaLink: t.canvaLink,
    pptLink: t.pptLink,
    slideLink: t.slideLink,
  }));

  const createPageHref = (page) => `/search?q=${encodeURIComponent(query)}&page=${page}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mt-4 w-full flex justify-between items-end gap-4">
        <div>
          <h3 className="text-2xl font-bold capitalize">Search Results</h3>
          <p className="text-sm text-gray-500 mt-1">{query ? `"${query}"` : "Type and press Enter from the navbar."}</p>
        </div>
      </div>

      {query && paginatedCards.length > 0 ? (
        <PaginatedCards cards={paginatedCards} />
      ) : (
        <div className="mt-8 rounded-md border border-dashed border-gray-300 px-4 py-10 text-center text-gray-500">
          {query ? "No result found." : "No search query provided."}
        </div>
      )}

      {query && total > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={createPageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-muted"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Link
              key={page}
              href={createPageHref(page)}
              className={`rounded-md border px-3 py-1.5 text-sm transition ${
                page === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {page}
            </Link>
          ))}

          <Link
            href={createPageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-muted"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}