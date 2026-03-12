"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { cardDataList } from "../store/storeData";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(cardDataList.length / cardsPerPage));
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedCards = cardDataList.slice(
    startIndex,
    startIndex + cardsPerPage,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h3 className="text-2xl font-bold capitalize">
        Wishlist
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {paginatedCards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            rating={card.rating}
            downloads={card.downloads}
            tags={card.tags}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className={`rounded-md border px-3 py-1.5 text-sm transition ${
            currentPage === 1
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
                pageNumber === currentPage
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
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
          className={`rounded-md border px-3 py-1.5 text-sm transition select-none cursor-pointer ${
            currentPage === totalPages
              ? "pointer-events-none opacity-50"
              : "cursor-pointer hover:bg-muted"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
