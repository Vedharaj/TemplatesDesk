"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import BossTemplateForm from "@/components/BossTemplateForm";

export default function NewTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: any) => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/boss/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error || "Failed to create template");
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
        <h1 className="text-3xl font-bold">Add Template</h1>
        <Link href="/boss/templates" className="text-sm text-primary hover:underline">
          Back to list
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <BossTemplateForm mode="create" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}