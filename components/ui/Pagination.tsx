"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/** Page numbers to show: always first, last and the current page's neighbours, with gaps as "…" */
function pageList(page: number, pages: number): (number | "gap")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | "gap")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pages - 1, page + 1);
  if (from > 2) out.push("gap");
  for (let p = from; p <= to; p++) out.push(p);
  if (to < pages - 1) out.push("gap");
  out.push(pages);
  return out;
}

const navBtn =
  "flex h-8 items-center gap-1 rounded-lg px-2.5 text-[12.5px] font-semibold text-foreground-secondary transition-colors cursor-pointer " +
  "hover:bg-border/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  sizes = [10, 25, 50],
  noun = "results",
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
  sizes?: number[];
  noun?: string;
}) {
  // Nothing to page through; the list shows its own empty message
  if (total === 0) return null;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const label = total === 1 ? noun.replace(/s$/, "") : noun;
  const count = <b className="font-semibold tabular-nums text-foreground">{total.toLocaleString("en-IN")}</b>;

  // Everything fits on the smallest page size: a count is all that's useful
  if (total <= Math.min(...sizes)) {
    return (
      <div className="border-t border-border px-4 py-3 text-[12.5px] text-foreground-tertiary sm:px-5">
        {count} {label}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-foreground-tertiary">
        <span>
          <b className="font-semibold tabular-nums text-foreground">{start}–{end}</b> of {count} {label}
        </span>
        <div className="hidden items-center gap-2 sm:flex">
          <span id="page-size-label">Per page</span>
          <div role="radiogroup" aria-labelledby="page-size-label" className="flex rounded-lg bg-surface-sunken p-0.5 ring-1 ring-divider">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={size === pageSize}
                onClick={() => onPageSize(size)}
                className={`h-6 min-w-8 cursor-pointer rounded-md px-2 text-[12px] font-semibold tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${size === pageSize ? "bg-surface text-accent shadow-sm" : "text-foreground-tertiary hover:text-foreground"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button className={navBtn} onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          {pageList(page, pages).map((p, i) =>
            p === "gap" ? (
              <span key={`gap${i}`} className="px-1 text-foreground-tertiary">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPage(p)}
                aria-current={p === page ? "page" : undefined}
                className={`size-8 cursor-pointer rounded-lg text-[12.5px] font-semibold tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${p === page ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground-secondary hover:bg-border/50 hover:text-foreground"}`}
              >
                {p}
              </button>
            ),
          )}
          <button className={navBtn} onClick={() => onPage(page + 1)} disabled={page >= pages} aria-label="Next page">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
