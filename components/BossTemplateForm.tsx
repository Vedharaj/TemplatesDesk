"use client";

import { useMemo, useState } from "react";

type BossTemplateFormValues = {
  title: string;
  description: string;
  images: string;
  tags: string;
  totalSlides: number;
  canvaLink: string;
  pptLink: string;
  slideLink: string;
  category: string;
  style: string;
  color: string;
  downloads: number;
  price: number;
  featured: boolean;
};

type BossTemplateFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<BossTemplateFormValues>;
  onSubmit: (values: BossTemplateFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

const defaultValues: BossTemplateFormValues = {
  title: "",
  description: "",
  images: "",
  tags: "",
  totalSlides: 0,
  canvaLink: "",
  pptLink: "",
  slideLink: "",
  category: "",
  style: "",
  color: "",
  downloads: 0,
  price: 0,
  featured: false,
};

export default function BossTemplateForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting = false,
}: BossTemplateFormProps) {
  const mergedInitial = useMemo(
    () => ({ ...defaultValues, ...(initialValues ?? {}) }),
    [initialValues]
  );

  const [form, setForm] = useState<BossTemplateFormValues>(mergedInitial);
  const [error, setError] = useState("");

  const update = (key: keyof BossTemplateFormValues, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.category.trim() || !form.style.trim()) {
      setError("Title, category and style are required.");
      return;
    }

    if (!form.canvaLink.trim() || !form.pptLink.trim() || !form.slideLink.trim()) {
      setError("Canva, PowerPoint and Google Slide links are required.");
      return;
    }

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-gray-600">Title</span>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">Category</span>
          <input
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">Style</span>
          <input
            value={form.style}
            onChange={(e) => update("style", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">Color</span>
          <input
            value={form.color}
            onChange={(e) => update("color", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-gray-600">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-gray-600">Images (comma separated URLs)</span>
          <textarea
            value={form.images}
            onChange={(e) => update("images", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-gray-600">Tags (comma separated)</span>
          <input
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">Total Slides</span>
          <input
            type="number"
            min={0}
            value={form.totalSlides}
            onChange={(e) => update("totalSlides", Number(e.target.value) || 0)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">Downloads</span>
          <input
            type="number"
            min={0}
            value={form.downloads}
            onChange={(e) => update("downloads", Number(e.target.value) || 0)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-600">Price</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value) || 0)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-gray-600">Canva Link</span>
          <input
            value={form.canvaLink}
            onChange={(e) => update("canvaLink", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-gray-600">PowerPoint Link</span>
          <input
            value={form.pptLink}
            onChange={(e) => update("pptLink", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-gray-600">Google Slides Link</span>
          <input
            value={form.slideLink}
            onChange={(e) => update("slideLink", e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-secondary disabled:opacity-60"
      >
        {isSubmitting
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
            ? "Create Template"
            : "Save Changes"}
      </button>
    </form>
  );
}
