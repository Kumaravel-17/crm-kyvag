import { Page, PageTitle } from "@/components/ui";
import CustomersTable from "./CustomersTable";

export default function CustomersPage() {
  return (
    <Page>
      <PageTitle
        eyebrow="Customers"
        title={<>Merchants who <em>pay</em></>}
        subtitle="Every lead that became a paying store."
      />

      <CustomersTable />
    </Page>
  );
}
