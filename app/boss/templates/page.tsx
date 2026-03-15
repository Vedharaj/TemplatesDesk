"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Funnel } from "lucide-react";

type Template = {
  id: number;
  title: string;
  category: string;
  style: string;
  price: number;
  featured: boolean;
};

export default function Templates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    category: "",
    style: "",
    featured: "all",
  });

  const [draftFilters, setDraftFilters] = useState({
    category: "",
    style: "",
    featured: "all",
  });

  const hasActiveFilters = useMemo(
    () => Boolean(filters.category || filters.style || filters.featured !== "all"),
    [filters]
  );

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (filters.category.trim()) {
        params.set("category", filters.category.trim());
      }

      if (filters.style.trim()) {
        params.set("style", filters.style.trim());
      }

      if (filters.featured === "featured") {
        params.set("featured", "true");
      }

      if (filters.featured === "normal") {
        params.set("featured", "false");
      }

      const res = await fetch(`/api/boss/templates?${params.toString()}`, { cache: "no-store" });
      const payload = await res.json();
      setTemplates(payload?.data ?? []);
      setTotalPages(Math.max(1, Number(payload?.pagination?.pages ?? 1)));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters.category, filters.featured, filters.style, search]);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  const deleteTemplate = async (id: number) => {
    const confirmed = window.confirm("Delete this template?");
    if (!confirmed) {
      return;
    }

    const res = await fetch(`/api/boss/templates/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadTemplates();
    }
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    const reset = { category: "", style: "", featured: "all" };
    setDraftFilters(reset);
    setFilters(reset);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const submitSearch = () => {
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/boss/logout", { method: "POST" });
      router.push("/boss/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Templates</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/boss/templates/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Add Template
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex h-10 min-w-55 flex-1 items-center rounded-md border border-gray-300 bg-white px-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitSearch();
              }
            }}
            placeholder="Search by title..."
            className="h-full w-full bg-transparent px-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={submitSearch}
            className="rounded bg-primary px-3 py-1 text-xs font-semibold text-white"
          >
            Search
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium transition hover:border-primary"
        >
          <Funnel size={16} />
          Filters
          {hasActiveFilters ? <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-white">On</span> : null}
        </button>
      </div>

      {isFilterOpen && (
        <div className="mt-3 rounded-md border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-gray-600">Category</span>
              <input
                value={draftFilters.category}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="business"
                className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-gray-600">Style</span>
              <input
                value={draftFilters.style}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, style: e.target.value }))}
                placeholder="modern"
                className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-gray-600">Status</span>
              <select
                value={draftFilters.featured}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, featured: e.target.value }))}
                className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-primary"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="normal">Normal</option>
              </select>
            </label>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 rounded-md border border-dashed border-gray-300 px-4 py-10 text-center text-gray-500">
          Loading templates...
        </div>
      ) : templates.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-gray-300 px-4 py-10 text-center text-gray-500">
          No templates found.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Style</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3 capitalize">{t.category}</td>
                  <td className="px-4 py-3 capitalize">{t.style}</td>
                  <td className="px-4 py-3">{t.price > 0 ? `$${t.price.toFixed(2)}` : "Free"}</td>
                  <td className="px-4 py-3">
                    {t.featured ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Featured</span>
                    ) : (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">Normal</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/boss/templates/edit/${t.id}`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void deleteTemplate(t.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-muted"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`rounded-md border px-3 py-1.5 text-sm transition ${
                page === currentPage ? "bg-primary text-white" : "hover:bg-muted"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-muted"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}