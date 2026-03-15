"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import { Skeleton } from "@/components/ui/skeleton";

type InteractionData = {
  liked: number[];
};

type TemplateApiItem = {
  id: number;
  title: string;
  rating: number;
  downloads: number;
  tags: unknown;
  images: unknown;
  canvaLink?: string;
  pptLink?: string;
  slideLink?: string;
};

const STORAGE_KEY = "template_interactions_v1";

function getLikedTemplateIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Partial<InteractionData>;
    if (!Array.isArray(parsed.liked)) {
      return [];
    }

    return parsed.liked.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  } catch {
    return [];
  }
}

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [likedTemplates, setLikedTemplates] = useState<TemplateApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncFromStorage = async () => {
      const ids = Array.from(new Set(getLikedTemplateIds()));

      if (ids.length === 0) {
        setLikedTemplates([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const templates = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`/api/${id}`, { cache: "no-store" });
            if (!res.ok) {
              return null;
            }

            const data = (await res.json()) as TemplateApiItem;
            return data;
          } catch {
            return null;
          }
        })
      );

      setLikedTemplates(templates.filter((item): item is TemplateApiItem => item !== null));
      setIsLoading(false);
    };

    void syncFromStorage();

    const handleStorage = () => {
      void syncFromStorage();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const likedCards = useMemo(() => {
    return likedTemplates.map((template) => {
      const tags = Array.isArray(template.tags)
        ? (template.tags as unknown[]).map(String).slice(0, 3)
        : [];

      const image = Array.isArray(template.images) && template.images.length > 0
        ? String((template.images as unknown[])[0])
        : "/image/placeholder.png";

      return {
        id: template.id,
        title: template.title,
        rating: template.rating,
        downloads: String(template.downloads ?? 0),
        tags,
        image,
        canvaLink: template.canvaLink,
        pptLink: template.pptLink,
        slideLink: template.slideLink,
      };
    });
  }, [likedTemplates]);

  const cardsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(likedCards.length / cardsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * cardsPerPage;
  const paginatedCards = likedCards.slice(
    startIndex,
    startIndex + cardsPerPage,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h3 className="text-2xl font-bold capitalize">
        Wishlist
      </h3>
      {isLoading ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-md border border-gray-100">
              <Skeleton className="h-40 w-full sm:h-48 lg:h-60" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : likedCards.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-gray-300 px-4 py-10 text-center text-gray-500">
          No liked templates yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {paginatedCards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                rating={card.rating}
                downloads={card.downloads}
                tags={card.tags}
                image={card.image}
                canvaLink={card.canvaLink}
                pptLink={card.pptLink}
                slideLink={card.slideLink}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))}
              disabled={safeCurrentPage === 1}
              className={`rounded-md border px-3 py-1.5 text-sm transition ${
                safeCurrentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-muted"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition select-none cursor-pointer ${
                    pageNumber === safeCurrentPage
                      ? "bg-primary text-primary-foreground"
                      : "cursor-pointer hover:bg-muted"
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.min(page, totalPages) + 1))}
              disabled={safeCurrentPage === totalPages}
              className={`rounded-md border px-3 py-1.5 text-sm transition select-none cursor-pointer ${
                safeCurrentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-muted"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
