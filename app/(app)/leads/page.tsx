import Link from "next/link";
import { Suspense } from "react";
import { PlusCircle } from "lucide-react";
import { Page, PageTitle, buttonClass } from "@/components/ui";
import LeadsTable from "./LeadsTable";

export default function LeadsPage() {
  return (
    <Page>
      <PageTitle
        eyebrow="Leads"
        title={<>Every merchant, <em>one record</em></>}
        subtitle="Leads from ads, DMs, WhatsApp, forms and imports, all in one place."
        actions={
          <>
            <Link href="/leads?new=1" className={buttonClass("primary")}><PlusCircle strokeWidth={2.5} />Add lead</Link>
          </>
        }
      />
      <Suspense>
        <LeadsTable />
      </Suspense>
    </Page>
  );
}
