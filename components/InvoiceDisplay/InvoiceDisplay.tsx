"use client";

import InvoiceNav from "../InvoiceNav/InvoiceNav";
import InvoiceList from "../InvoiceList/InvoiceList";
import { Invoice } from "@/types/Invoice";

interface InvoiceDisplayProps {
  filteredInvoices: Invoice[];
  invoicesLoaded: boolean;
  loading: boolean;
}

const InvoiceDisplay = ({
  filteredInvoices,
  invoicesLoaded,
  loading,
}: InvoiceDisplayProps) => {
  return (
    <div className="w-full h-full">
      <InvoiceNav invoiceTotal={filteredInvoices.length} loading={loading} />
      <InvoiceList
        invoicesLoaded={invoicesLoaded}
        filteredInvoices={filteredInvoices}
        loading={loading}
      />
    </div>
  );
};

export default InvoiceDisplay;
