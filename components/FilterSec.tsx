"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilterBtn from "@/components/FilterBtn";
import { ColorList, StyleList } from "@/app/store/storeData";

type FilterSecProps = {
  categories: string[];
  isFilterVisible?: boolean;
};

const toSectionId = (value: string) =>
  `category-${value.toLowerCase().replace(/\s+/g, "-")}`;

const FilterSec = ({ categories, isFilterVisible }: FilterSecProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount = 220;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleNavigate = (category: string) => {
    const section = document.getElementById(toSectionId(category));
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mt-4 sm:mt-8 flex items-center justify-between gap-3 px-4 sm:px-12">
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => handleScroll("left")}
        className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white"
      >
        <ChevronLeft size={32} className="cursor-pointer" />
      </button>

      <div
        ref={scrollRef}
        className="flex w-full items-center gap-2 select-none overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleNavigate(category)}
            className="cursor-pointer shrink-0 rounded-full border-2 border-transparent bg-primary px-3 py-1 text-sm font-medium text-white transition-colors hover:border-primary hover:bg-white hover:text-primary"
          >
            {category}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => handleScroll("right")}
        className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white"
      >
        <ChevronRight size={32} className="cursor-pointer" />
      </button>
        {isFilterVisible && (
          <FilterBtn categories={categories} colors={ColorList} styles={StyleList} />
        )}
    </div>
  );
};

export default FilterSec;
