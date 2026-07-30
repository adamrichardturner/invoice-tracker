"use client";

import InvoiceDisplay from "@/components/InvoiceDisplay/InvoiceDisplay";
import useInvoices from "@/hooks/invoices/useInvoices";
import useFilteredInvoices from "../hooks/invoices/useFilteredInvoices";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useUIStore } from "@/stores/UIState/useUIStore";

export default function InvoicesPage() {
  const {
    loading,
    loadingMore,
    invoicesLoaded,
    fetchInvoices,
    fetchMoreInvoices,
    hasMore,
    totalCount,
  } = useInvoices();
  const { filteredInvoices } = useFilteredInvoices();
  const selectedFilters = useUIStore((state) => state.selectedFilters);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices, selectedFilters]);

  return (
    <div className="flex min-h-screen w-full items-start justify-center pt-[120px] md:pl-[103px] md:pt-[77px]">
      <Sidebar />
      <main className="flex flex-col h-full w-full md:w-[768px] items-center justify-center mx-4">
        <InvoiceDisplay
          filteredInvoices={filteredInvoices}
          invoicesLoaded={invoicesLoaded}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          invoiceTotal={totalCount}
          onLoadMore={fetchMoreInvoices}
        />
      </main>
    </div>
  );
}
