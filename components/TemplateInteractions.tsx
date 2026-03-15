"use client";

import { Heart, Share } from "lucide-react";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import { useCallback, useEffect, useMemo, useState } from "react";

type InteractionData = {
  liked: number[];
  shared: number[];
  ratings: Record<string, number>;
};

type TemplateInteractionsProps = {
  templateId: number;
  initialLikes: number;
  initialShares: number;
  initialRating: number;
};

const STORAGE_KEY = "template_interactions_v1";

const ratingItemStyles = {
  itemShapes: RoundedStar,
  activeFillColor: "#facc15",
  inactiveFillColor: "#fde68a",
};

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

export default function TemplateInteractions({
  templateId,
  initialLikes,
  initialShares,
  initialRating,
}: TemplateInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [averageRating, setAverageRating] = useState(initialRating);
      const [hasLiked, setHasLiked] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const interactionData = readInteractions();
    setHasLiked(interactionData.liked.includes(templateId));
    setHasShared(interactionData.shared.includes(templateId));
    setUserRating(Number(interactionData.ratings[String(templateId)] ?? 0));
  }, [templateId]);

  const canLike = useMemo(() => !hasLiked, [hasLiked]);
  const canShare = useMemo(() => !hasShared, [hasShared]);
  const canRate = useMemo(() => userRating === 0, [userRating]);

  const likeTemplate = useCallback(async () => {
    if (!canLike) {
      return;
    }

    setHasLiked(true);
    setLikes((prev) => prev + 1);

    const data = readInteractions();
    if (!data.liked.includes(templateId)) {
      data.liked.push(templateId);
      writeInteractions(data);
    }

    try {
      const res = await fetch(`/api/template/${templateId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("like_failed");
      }

      const payload = await res.json();
      if (typeof payload.likes === "number") {
        setLikes(payload.likes);
      }
    } catch {
      setHasLiked(false);
      setLikes((prev) => Math.max(initialLikes, prev - 1));
      const rollback = readInteractions();
      rollback.liked = rollback.liked.filter((id) => id !== templateId);
      writeInteractions(rollback);
    }
  }, [canLike, initialLikes, templateId]);

  const shareTemplate = useCallback(async () => {
    if (!canShare) {
      return;
    }

    setHasShared(true);
    setShares((prev) => prev + 1);

    const data = readInteractions();
    if (!data.shared.includes(templateId)) {
      data.shared.push(templateId);
      writeInteractions(data);
    }

    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
      } else if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }

      const res = await fetch(`/api/template/${templateId}/share`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("share_failed");
      }

      const payload = await res.json();
      if (typeof payload.shares === "number") {
        setShares(payload.shares);
      }
    } catch {
      setHasShared(false);
      setShares((prev) => Math.max(initialShares, prev - 1));
      const rollback = readInteractions();
      rollback.shared = rollback.shared.filter((id) => id !== templateId);
      writeInteractions(rollback);
    }
  }, [canShare, initialShares, templateId]);

  const rateTemplate = useCallback(
    async (selectedRating: number) => {
      if (!canRate || selectedRating < 1) {
        return;
      }

      setUserRating(selectedRating);

      const data = readInteractions();
      data.ratings[String(templateId)] = selectedRating;
      writeInteractions(data);

      try {
        const res = await fetch(`/api/template/${templateId}/rate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: selectedRating }),
        });

        if (!res.ok) {
          throw new Error("rate_failed");
        }

        const payload = await res.json();
        if (typeof payload.rating === "number") {
          setAverageRating(payload.rating);
        }
      } catch {
        setUserRating(0);
        const rollback = readInteractions();
        delete rollback.ratings[String(templateId)];
        writeInteractions(rollback);
      }
    },
    [canRate, templateId]
  );

  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">
      <button
        type="button"
        onClick={likeTemplate}
        disabled={!canLike}
            className={`group flex w-full ${hasLiked ? "bg-red-600" : ""} cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-red-400 px-3 py-2 text-sm transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-base lg:w-auto lg:justify-start`}
      >
        <Heart
          size={20}
          className={`transition-colors ${hasLiked ? "text-white" : "text-red-400 group-hover:text-white"}`}
        />
        <span className={`ml-1 transition-colors ${hasLiked ? "text-white" : "text-red-400 group-hover:text-white"}`}>
          {likes}
        </span>
      </button>

      <button
        type="button"
        onClick={shareTemplate}
        disabled={!canShare}
            className={`group flex w-full ${hasShared ? "bg-purple-600" : ""} items-center justify-center gap-1 rounded-md border-2 border-purple-400 px-3 py-2 text-sm transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-base lg:w-auto lg:justify-start`}
      >
        <Share
          size={20}
          className={`transition-colors ${hasShared ? "text-white" : "text-purple-400 group-hover:text-white"}`}
        />
        <span className={`ml-1 transition-colors ${hasShared ? "text-white" : "text-purple-400 group-hover:text-white"}`}>
          {shares}
        </span>
      </button>

      <div className={`group flex ${userRating && "bg-yellow-600"} w-full items-center justify-center gap-1 rounded-md border-2 border-yellow-400 px-3 py-2 text-sm transition hover:bg-yellow-100 sm:px-4 sm:text-base lg:w-auto lg:justify-start`}>
        <div className="w-20 sm:w-24 lg:w-28">
          <Rating
            style={{ maxWidth: "100%" }}
            value={canRate ? averageRating : userRating}
            onChange={rateTemplate}
            readOnly
            itemStyles={ratingItemStyles}
          />
        </div>
        <span className="ml-1 text-yellow-400 transition-colors select-none group-hover:text-white">
          {averageRating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
