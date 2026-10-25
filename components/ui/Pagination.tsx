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
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
      <div className="flex items-center gap-4 text-[12.5px] text-foreground-tertiary">
        <span>
          Showing <b className="font-semibold tabular-nums text-foreground">{start}–{end}</b> of{" "}
          <b className="font-semibold tabular-nums text-foreground">{total}</b> {noun}
        </span>
        <label className="hidden items-center gap-2 sm:flex">
          Rows
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="cursor-pointer rounded-lg border border-input-border bg-input-bg px-2 py-1 text-[12.5px] font-semibold text-foreground outline-none focus:border-accent"
          >
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

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
    </div>
  );
}
