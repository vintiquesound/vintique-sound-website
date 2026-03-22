import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

type SortDir = "asc" | "desc"

type Props = {
  columns: string[]
  rows: Array<Record<string, string>>
  initialSortKey?: string
  initialSortDir?: SortDir
  searchPlaceholder?: string
}

function toSearchableText(row: Record<string, string>, columns: string[]): string {
  return columns
    .map((c) => row[c] ?? "")
    .join(" ")
    .toLowerCase()
}

export default function ClientsAndCreditsTable({
  columns,
  rows,
  initialSortKey,
  initialSortDir = "asc",
  searchPlaceholder = "Search clients, projects, credits…",
}: Props) {
  const [query, setQuery] = React.useState("")
  const [sortKey, setSortKey] = React.useState<string | null>(
    initialSortKey && columns.includes(initialSortKey) ? initialSortKey : columns[0] ?? null
  )
  const [sortDir, setSortDir] = React.useState<SortDir>(initialSortDir)

  const collator = React.useMemo(
    () => new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }),
    []
  )

  const indexed = React.useMemo(() => {
    return rows.map((row, idx) => ({
      row,
      idx,
      searchable: toSearchableText(row, columns),
    }))
  }, [columns, rows])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return indexed
    return indexed.filter((item) => item.searchable.includes(q))
  }, [indexed, query])

  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered

    const dir = sortDir
    const key = sortKey

    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = (a.row[key] ?? "").trim()
      const bv = (b.row[key] ?? "").trim()

      // Stable sort fallback
      const primary = collator.compare(av, bv)
      if (primary !== 0) return dir === "asc" ? primary : -primary
      return a.idx - b.idx
    })

    return copy
  }, [collator, filtered, sortDir, sortKey])

  const visibleRows = React.useMemo(() => sorted.map((x) => x.row), [sorted])

  const onHeaderClick = React.useCallback(
    (key: string) => {
      setSortKey((prevKey) => {
        if (prevKey === key) {
          setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"))
          return prevKey
        }
        setSortDir("asc")
        return key
      })
    },
    []
  )

  const clearQuery = React.useCallback(() => setQuery(""), [])

  const totalCount = rows.length
  const shownCount = visibleRows.length

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{shownCount}</span> of{" "}
            <span className="text-foreground font-medium">{totalCount}</span>
          </p>
        </div>

        <div className="w-full sm:w-[24rem]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-input-background pl-9 pr-9 py-2 text-sm",
                "ring-offset-background placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
            {query.trim().length > 0 && (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                useHoverScale={false}
                borderNone
                onClick={clearQuery}
                className="absolute right-1 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
                title="Clear"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden md:block">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-muted font-bold backdrop-blur supports-backdrop-filter:bg-muted border-b">
                <tr>
                  {columns.map((col) => {
                    const isActive = sortKey === col
                    const Icon = !isActive
                      ? ArrowUpDown
                      : sortDir === "asc"
                        ? ArrowUp
                        : ArrowDown

                    return (
                      <th key={col} className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                        <Button
                          type="button"
                          variant="text"
                          size="sm"
                          useHoverScale={false}
                          borderNone
                          onClick={() => onHeaderClick(col)}
                          className={cn(
                            "p-0 h-auto font-semibold",
                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}
                          aria-label={`Sort by ${col}`}
                          title={`Sort by ${col}`}
                        >
                          <span>{col}</span>
                          <Icon className="size-4" />
                        </Button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={Math.max(1, columns.length)} className="px-4 py-10 text-center">
                      <div className="text-muted-foreground">No results found.</div>
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        "border-b last:border-b-0",
                        idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                      )}
                    >
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-3 align-top">
                          <span className="text-foreground">{row[col] ?? ""}</span>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 md:hidden">
        {visibleRows.length === 0 ? (
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 text-center">
            <div className="text-muted-foreground">No results found.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleRows.map((row, idx) => (
              <div key={idx} className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
                <div className="space-y-2">
                  {columns.map((col) => (
                    <div key={col} className="grid grid-cols-3 gap-3">
                      <div className="text-xs text-muted-foreground col-span-1">{col}</div>
                      <div className="text-sm col-span-2 text-foreground">{row[col] ?? ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
