"use client";

import InvoiceNav from "../InvoiceNav/InvoiceNav";
import InvoiceList from "../InvoiceList/InvoiceList";
import { Invoice } from "@/types/Invoice";

interface InvoiceDisplayProps {
  filteredInvoices: Invoice[];
  invoicesLoaded: boolean;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  invoiceTotal: number;
  onLoadMore: () => void;
}

const InvoiceDisplay = ({
  filteredInvoices,
  invoicesLoaded,
  loading,
  loadingMore,
  hasMore,
  invoiceTotal,
  onLoadMore,
}: InvoiceDisplayProps) => {
  return (
    <div className="w-full h-full">
      <InvoiceNav invoiceTotal={invoiceTotal} loading={loading} />
      <InvoiceList
        invoicesLoaded={invoicesLoaded}
        filteredInvoices={filteredInvoices}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};

export default InvoiceDisplay;
