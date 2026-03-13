"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CardContainerProps {
  children: ReactNode;
  title: string;
  isViewMore?: boolean;
}

const CardContainer = ({ children, title, isViewMore }: CardContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
  };

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const amount = Math.max(220, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollState();

    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [children]);

  return (
    <div className="mt-4 sm:mt-8">
      <div className="flex justify-between">
        <span className="text-2xl font-bold capitalize">{title}</span>

        {isViewMore && (
          <Link href={"/categories/" + title} className="text-primary underline">
            view more
          </Link>
        )}
      </div>
      <div className="group/card-scroll relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 w-full overflow-x-auto overflow-y-hidden scroll-smooth py-4 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        >
          {children}

        </div>
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount("right")}
              className="hidden md:block absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-200 cursor-pointer md:opacity-0 md:pointer-events-none md:group-hover/card-scroll:opacity-100 md:group-hover/card-scroll:pointer-events-auto"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByAmount("left")}
              className="hidden md:block absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-200 cursor-pointer md:opacity-0 md:pointer-events-none md:group-hover/card-scroll:opacity-100 md:group-hover/card-scroll:pointer-events-auto"
            >
              <ChevronLeft size={20} />
            </button>
          )}
      </div>
    </div>
  );
};

export default CardContainer;
