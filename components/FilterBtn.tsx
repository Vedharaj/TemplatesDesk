"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Funnel, ChevronDown, ChevronUp } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"

type FilterBtnProps = {
  categories: string[]
  colors: string[]
  styles: string[]
  currentType?: string
}

const COLOR_SWATCHES: Record<string, string> = {
  white:  "#ffffff",
  black:  "#1a1a1a",
  red:    "#ef4444",
  blue:   "#3b82f6",
  green:  "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
  pink:   "#ec4899",
  gray:   "#6b7280",
}

type SectionKey = "categories" | "colors" | "styles"

type FilterSectionProps = {
  label: string
  items: string[]
  selected: string[]
  isOpen: boolean
  onToggleSection: () => void
  renderItem: (item: string) => React.ReactNode
}

const FilterSection = ({
  label,
  items,
  selected,
  isOpen,
  onToggleSection,
  renderItem,
}: FilterSectionProps) => (
  <div className="border-b border-border last:border-0">
    <button
      type="button"
      onClick={onToggleSection}
      className="flex w-full items-center justify-between py-3 px-4 font-semibold text-sm uppercase tracking-wide text-foreground hover:text-primary transition-colors"
    >
      <span>
        {label}
        {selected.length > 0 && (
          <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {selected.length}
          </span>
        )}
      </span>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && (
      <div className="pb-3 px-4 flex flex-col gap-2">
        {items.map(renderItem)}
      </div>
    )}
  </div>
)

const FilterBtn = ({ categories, colors, styles, currentType }: FilterBtnProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const didCheckReload = useRef(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const [selected, setSelected] = useState<Record<SectionKey, string[]>>({
    categories: [],
    colors: [],
    styles: [],
  })
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    categories: true,
    colors: true,
    styles: true,
  })

  useEffect(() => {
    setSelected({ categories: [], colors: [], styles: [] })
    setOpen({ categories: true, colors: true, styles: true })
    setIsSheetOpen(false)
  }, [pathname])

  useEffect(() => {
    if (didCheckReload.current) {
      return
    }
    didCheckReload.current = true

    const entries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
    const isReload = entries[0]?.type === "reload"
    if (!isReload) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    const hasFilterParams = params.has("category") || params.has("color") || params.has("style")
    if (!hasFilterParams) {
      return
    }

    params.delete("category")
    params.delete("color")
    params.delete("style")
    params.set("page", "1")
    router.replace(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  const toggle = (section: SectionKey, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter((v) => v !== value)
        : [...prev[section], value],
    }))
  }

  const toggleSection = (section: SectionKey) =>
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }))

  const totalSelected =
    selected.categories.length + selected.colors.length + selected.styles.length

  const normalizedCurrentType = currentType?.toLowerCase()
  const showCategories = normalizedCurrentType !== "category" && normalizedCurrentType !== "categories"
  const showColors = normalizedCurrentType !== "color" && normalizedCurrentType !== "colors"
  const showStyles = normalizedCurrentType !== "style" && normalizedCurrentType !== "styles"

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams.toString())

    const selectedCategory = selected.categories[0]
    const selectedColor = selected.colors[0]
    const selectedStyle = selected.styles[0]

    if (selectedCategory) params.set("category", selectedCategory)
    else params.delete("category")

    if (selectedColor) params.set("color", selectedColor)
    else params.delete("color")

    if (selectedStyle) params.set("style", selectedStyle)
    else params.delete("style")

    params.set("page", "1")
    setIsSheetOpen(false)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("color")
    params.delete("style")
    params.set("page", "1")
    setSelected({ categories: [], colors: [], styles: [] })

    setIsSheetOpen(false)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <button className="relative flex items-center rounded cursor-pointer border-2 border-primary bg-primary px-2 sm:px-3 py-1 text-sm font-medium text-white transition-colors hover:border-primary hover:bg-white hover:text-primary">
          <Funnel size={20} />
          <span className="ml-1 text-lg font-bold sm:text-xl">Filter</span>
          {totalSelected > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary text-[10px] font-bold border border-primary">
              {totalSelected}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col p-0 gap-0">
        <SheetHeader className="px-4 py-4 border-b border-border">
          <SheetTitle className="text-base font-bold">Filters</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {showCategories && (
            <FilterSection
              label="Category"
              items={categories}
              selected={selected.categories}
              isOpen={open.categories}
              onToggleSection={() => toggleSection("categories")}
              renderItem={(item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer capitalize">
                  <input
                    type="checkbox"
                    checked={selected.categories.includes(item)}
                    onChange={() => toggle("categories", item)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              )}
            />
          )}

          {showColors && (
            <FilterSection
              label="Color"
              items={colors}
              selected={selected.colors}
              isOpen={open.colors}
              onToggleSection={() => toggleSection("colors")}
              renderItem={(item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer capitalize">
                  <input
                    type="checkbox"
                    checked={selected.colors.includes(item)}
                    onChange={() => toggle("colors", item)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      selected.colors.includes(item)
                        ? "border-primary ring-2 ring-primary ring-offset-1"
                        : "border-muted-foreground/30"
                    } ${item === "white" ? "shadow-sm" : ""}`}
                    style={{ backgroundColor: COLOR_SWATCHES[item] ?? item }}
                  />
                  <span className="text-sm">{item}</span>
                </label>
              )}
            />
          )}

          {showStyles && (
            <FilterSection
              label="Style"
              items={styles}
              selected={selected.styles}
              isOpen={open.styles}
              onToggleSection={() => toggleSection("styles")}
              renderItem={(item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer capitalize">
                  <input
                    type="checkbox"
                    checked={selected.styles.includes(item)}
                    onChange={() => toggle("styles", item)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              )}
            />
          )}
        </div>

        <SheetFooter className="flex flex-row gap-2 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 rounded border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded border-2 border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Apply Filters
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default FilterBtn