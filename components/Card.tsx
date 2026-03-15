"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Share, Star, Download } from "lucide-react";
import { useEffect, useState } from "react";

type InteractionData = {
  liked: number[];
  shared: number[];
  ratings: Record<string, number>;
};

const STORAGE_KEY = "template_interactions_v1";

function readInteractions(): InteractionData {
  if (typeof window === "undefined") {
    return { liked: [], shared: [], ratings: {} };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { liked: [], shared: [], ratings: {} };
    }

    const parsed = JSON.parse(raw) as Partial<InteractionData>;
    return {
      liked: Array.isArray(parsed.liked) ? parsed.liked.map(Number).filter(Number.isFinite) : [],
      shared: Array.isArray(parsed.shared) ? parsed.shared.map(Number).filter(Number.isFinite) : [],
      ratings: typeof parsed.ratings === "object" && parsed.ratings ? parsed.ratings as Record<string, number> : {},
    };
  } catch {
    return { liked: [], shared: [], ratings: {} };
  }
}

function writeInteractions(data: InteractionData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

type CardProps = {
  id: number;
  title: string;
  rating: number;
  downloads: string;
  image: string;
  tags: string[];
  canvaLink?: string;
  pptLink?: string;
  slideLink?: string;
};

const Card = ({
  id,
  title,
  rating,
  downloads,
  tags,
  image,
  canvaLink,
  pptLink,
  slideLink,
}: CardProps) => {
  const url = title.toLowerCase().replace(/\s+/g, "-") + "/" + id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isReady, setIsReady] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [isLikePending, setIsLikePending] = useState(false);
  const [isSharePending, setIsSharePending] = useState(false);

  useEffect(() => {
    const interactionData = readInteractions();
    setHasLiked(interactionData.liked.includes(id));
    setHasShared(interactionData.shared.includes(id));
  }, [id]);

  useEffect(() => {
    if (!isModalOpen || isReady) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isModalOpen, isReady]);

  const toggleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLikePending) {
      return;
    }

    const wasLiked = hasLiked;
    setIsLikePending(true);
    setHasLiked(!wasLiked);

    const data = readInteractions();
    if (wasLiked) {
      data.liked = data.liked.filter((templateId) => templateId !== id);
    } else if (!data.liked.includes(id)) {
      data.liked.push(id);
    }
    writeInteractions(data);
    try {
      const res = await fetch(`/api/template/${id}/like`, {
        method: wasLiked ? "DELETE" : "POST",
      });

      if (!res.ok) {
        throw new Error("like_failed");
      }
    } catch {
      setHasLiked(wasLiked);
      const rollback = readInteractions();
      if (wasLiked) {
        if (!rollback.liked.includes(id)) {
          rollback.liked.push(id);
        }
      } else {
        rollback.liked = rollback.liked.filter((templateId) => templateId !== id);
      }
      writeInteractions(rollback);
    } finally {
      setIsLikePending(false);
    }
  };

  const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (hasShared || isSharePending) {
      return;
    }

    setIsSharePending(true);
    setHasShared(true);

    const data = readInteractions();
    if (!data.shared.includes(id)) {
      data.shared.push(id);
      writeInteractions(data);
    }

    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({ title, url: `${window.location.origin}/template/${url}` });
      } else if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${window.location.origin}/template/${url}`);
      }

      const res = await fetch(`/api/template/${id}/share`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("share_failed");
      }
    } catch {
      setHasShared(false);
      const rollback = readInteractions();
      rollback.shared = rollback.shared.filter((templateId) => templateId !== id);
      writeInteractions(rollback);
    } finally {
      setIsSharePending(false);
    }
  };

  const renderDownloadAction = (href: string | undefined, label: string, icon: React.ReactNode, className: string) => {
    if (!href) {
      return (
        <button
          type="button"
          disabled
          className={`${className} cursor-not-allowed opacity-50`}
        >
          {icon}
          <span>{label}</span>
        </button>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {icon}
        <span>{label}</span>
      </a>
    );
  };

  return (
    <div className="min-w-50 sm:min-w-65 lg:min-w-90 shrink-0">
      <div className="relative group">
        <Link href={`/template/${url}`} className="block cursor-pointer">
          <Image
            src={image}
            alt="Card Image"
            width={300}
            height={200}
            className="w-full h-40 sm:h-48 lg:h-60 object-cover"
          />

          <div className="absolute inset-0 cursor-pointer bg-linear-to-t from-gray-500/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="absolute top-2 right-4 flex gap-2">
              <button
                type="button"
                onClick={toggleLike}
                disabled={isLikePending}
                className={`px-2 py-1  cursor-pointer rounded transition ${hasLiked ? "bg-red-600 text-white" : "text-gray-400 bg-white hover:bg-secondary hover:text-white"} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <Heart size={20} />
            </button>

              <button
                type="button"
                onClick={handleShare}
                disabled={hasShared || isSharePending}
                className={`px-2 py-1 cursor-pointer rounded transition ${hasShared ? "bg-purple-600 text-white" : "text-gray-400 bg-white hover:bg-secondary hover:text-white"} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <Share size={20} />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 text-white text-sm">
              <h3 className="text-lg font-bold select-none">16:9</h3>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex justify-between mt-2 px-2">
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="cursor-pointer rounded border-2 border-transparent bg-gray-200 px-2 sm:px-3 py-1 text-sm font-medium text-gray-700 hover:border-primary hover:bg-white hover:text-primary"
            >
              <span>{tag}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400" />
          <span className="text-sm sm:text-base lg    :text-lg text-yellow-400 font-bold">
            {rating}
          </span>
        </div>
      </div>

      <div className="px-2 mt-1">
        <Link href={`/template/${url}`} className="text-gray-800 hover:text-primary text-md font-medium">
          <h2 className="text-lg font-bold">{title}</h2>
        </Link>
        <button
          type="button"
          onClick={() => {
            setCountdown(5);
            setIsReady(false);
            setIsModalOpen(true);
          }}
          className="mt-2 w-full cursor-pointer bg-primary text-white px-3 sm:px-4 py-2 flex justify-center items-center gap-1 sm:gap-2 rounded hover:bg-secondary"
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5 inline-block" />
          <span className="text-sm sm:text-base lg:text-lg font-bold whitespace-nowrap">
            {downloads} Download
          </span>
          <Image
            src="/icons/canva.svg"
            alt="Canva icon"
            width={24}
            height={24}
          />
          <Image
            src="/icons/powerpoint.svg"
            alt="PowerPoint icon"
            width={24}
            height={24}
          />
          <Image
            src="/icons/google-slides.svg"
            alt="Google Slides icon"
            width={24}
            height={24}
          />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Prepare Download</h3>
                <p className="text-sm text-gray-500">Your links will appear after countdown.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setCountdown(5);
                  setIsReady(false);
                }}
                className="rounded-md border px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            {!isReady ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">
                <p className="text-sm text-gray-600">Download links unlocking in</p>
                <p className="mt-1 text-4xl font-bold text-primary">{countdown}s</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {renderDownloadAction(
                  canvaLink,
                  "Canva",
                  <Image src="/icons/canva.svg" alt="Canva icon" width={22} height={22} />,
                  "flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-purple-600 to-purple-400 px-3 py-2 text-sm font-semibold text-white hover:from-purple-500 hover:to-purple-600"
                )}
                {renderDownloadAction(
                  pptLink,
                  "PowerPoint",
                  <Image src="/icons/powerpoint.svg" alt="PowerPoint icon" width={22} height={22} />,
                  "flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-red-600 to-red-400 px-3 py-2 text-sm font-semibold text-white hover:from-red-500 hover:to-red-600"
                )}
                {renderDownloadAction(
                  slideLink,
                  "Slides",
                  <Image src="/icons/google-slides.svg" alt="Google Slides icon" width={22} height={22} />,
                  "flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-yellow-400 to-yellow-300 px-3 py-2 text-sm font-semibold text-white hover:from-yellow-500 hover:to-yellow-600"
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
