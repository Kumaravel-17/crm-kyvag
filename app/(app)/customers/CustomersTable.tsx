"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { LeadList, LoadError } from "@/components/LeadList";
import { Card, Pagination } from "@/components/ui";
import { api } from "@/lib/api";
import { useApi, useDebounced } from "@/lib/useApi";

export default function CustomersTable() {
  const [q, setQ] = useState("");
  const search = useDebounced(q.trim());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // A new search starts again from the first page
  useEffect(() => setPage(1), [search, pageSize]);

  const { data, error, loading, reload } = useApi(() => api.customers({ q: search, page, pageSize }), [search, page, pageSize]);

  return (
    <Card className="overflow-hidden hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border px-4 py-3.5 sm:px-5">
        <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-foreground-tertiary focus-within:border-accent">
          <Search className="size-4 shrink-0" />
          <input id="customer-search" className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-tertiary" placeholder="Name, store, domain, phone or email" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : (
        <LeadList
          leads={data?.customers ?? []}
          variant="customers"
          loading={loading}
          empty={search ? "No customers match this search." : "No paying customers yet. Leads appear here when they move to the paid stage."}
        />
      )}

      <Pagination page={page} pageSize={pageSize} total={data?.total ?? 0} noun="customers" onPage={setPage} onPageSize={setPageSize} />
    </Card>
  );
}
