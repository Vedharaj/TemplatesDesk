"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Shrink } from "lucide-react";
import Image from "next/image";

interface TemplateImageGalleryProps {
  title: string;
  image: string;
  images: string[];
  totalSlides: number;
}

const TemplateImageGallery = ({
  title,
  image,
  images,
  totalSlides,
}: TemplateImageGalleryProps) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideCount = Math.min(totalSlides, images.length);
  const safeCurrentSlide = Math.min(currentSlide, Math.max(slideCount - 1, 0));
  const currentSlideLabel = slideCount === 0 ? 0 : safeCurrentSlide + 1;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === galleryRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(
        maxScrollLeft > 1 && element.scrollLeft < maxScrollLeft - 1,
      );
    };

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        const isTypingTarget =
          tagName === "input" ||
          tagName === "textarea" ||
          target.isContentEditable;

        if (isTypingTarget) {
          return;
        }
      }

      if (event.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(prev + 1, slideCount - 1));
      }

      if (event.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slideCount]);

  const scrollByAmount = (direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const amount = Math.max(220, Math.floor(element.clientWidth * 0.8));
    element.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const toggleFullscreen = async () => {
    if (!galleryRef.current) {
      return;
    }

    if (document.fullscreenElement === galleryRef.current) {
      await document.exitFullscreen();
      return;
    }

    await galleryRef.current.requestFullscreen();
  };

  return (
    <div
      ref={galleryRef}
      className="w-full max-w-200 select-none data-[fullscreen=true]:max-w-none"
      data-fullscreen={isFullscreen}
    >
      <div className="relative w-full group">
        <Image
          src={images[safeCurrentSlide] ?? image}
          alt={title}
          width={800}
          height={600}
          className="h-auto w-full object-cover"
        />
        <div className="absolute top-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
          {currentSlideLabel}/{slideCount}
        </div>
        <div className="absolute right-1 bottom-1 left-1 p-8 opacity-0 transition delay-200 ease-in group-hover:opacity-100">
          <div className="flex items-center gap-1">
            {Array.from({ length: slideCount }).map((_, index) => (
              <span
                key={index}
                className={`h-1 flex-1 bg-white transition-opacity ${
                  safeCurrentSlide === index
                    ? "opacity-100"
                    : "cursor-pointer opacity-50 hover:opacity-100"
                } ${index === 0 ? "rounded-l-full" : ""} ${index === slideCount - 1 ? "rounded-r-full" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
          <div className="mt-3 ml-auto flex w-fit items-center gap-2">
            <button
              type="button"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              onClick={toggleFullscreen}
              className="rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-200"
            >
              {isFullscreen ? <Shrink size={12} /> : <Expand size={12} />}
            </button>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              className="rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-200"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() =>
                setCurrentSlide((prev) => Math.min(prev + 1, slideCount - 1))
              }
              className="rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-200"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
      <div className="group/card-scroll relative mt-2">
        <div
          ref={scrollRef}
          className="flex w-full gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, index) => (
            <div key={index} className="relative shrink-0 cursor-pointer">
              <Image
                width={150}
                height={100}
                src={img}
                alt={`${title} - ${index + 1}`}
                className="w-full object-cover"
                onClick={() => setCurrentSlide(index)}
              />
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByAmount("right")}
            className="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-200 md:block md:opacity-0 md:pointer-events-none md:group-hover/card-scroll:opacity-100 md:group-hover/card-scroll:pointer-events-auto"
          >
            <ChevronRight size={12} />
          </button>
        )}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByAmount("left")}
            className="absolute top-1/2 left-2 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition hover:bg-gray-200 md:block md:opacity-0 md:pointer-events-none md:group-hover/card-scroll:opacity-100 md:group-hover/card-scroll:pointer-events-auto"
          >
            <ChevronLeft size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TemplateImageGallery;
