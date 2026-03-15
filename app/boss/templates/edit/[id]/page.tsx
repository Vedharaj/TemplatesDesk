"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BossTemplateForm from "@/components/BossTemplateForm";

type TemplatePayload = {
  title: string;
  description: string | null;
  images: unknown;
  tags: unknown;
  totalSlides: number;
  canvaLink: string;
  pptLink: string;
  slideLink: string;
  category: string;
  style: string;
  color: string | null;
  downloads: number;
  price: number;
  featured: boolean;
};

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<TemplatePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/boss/templates/${id}`, { cache: "no-store" });
        if (!res.ok) {
          setError("Template not found");
          return;
        }

        const payload = (await res.json()) as TemplatePayload;
        setData(payload);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  const initialValues = useMemo(() => {
    if (!data) {
      return undefined;
    }

    return {
      title: data.title,
      description: data.description ?? "",
      images: Array.isArray(data.images) ? data.images.join(", ") : "",
      tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
      totalSlides: data.totalSlides,
      canvaLink: data.canvaLink,
      pptLink: data.pptLink,
      slideLink: data.slideLink,
      category: data.category,
      style: data.style,
      color: data.color ?? "",
      downloads: data.downloads,
      price: data.price,
      featured: data.featured,
    };
  }, [data]);

  const handleSubmit = async (values: any) => {
    if (!id) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/boss/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error || "Failed to update template");
        return;
      }

      router.push("/boss/templates");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Template</h1>
        <Link href="/boss/templates" className="text-sm text-primary hover:underline">
          Back to list
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading template...</p>
        ) : !initialValues ? (
          <p className="text-sm text-red-500">{error || "Template not found"}</p>
        ) : (
          <BossTemplateForm
            mode="edit"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {error && initialValues && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}