// components/InvoiceList/InvoiceList.tsx
"use client";

import { Invoice } from "@/types/Invoice";
import { InvoiceCard } from "../InvoiceCard/InvoiceCard";
import { SkeletonInvoiceCard } from "../InvoiceCard/SkeletonInvoiceCard";
import Placeholder from "@/assets/ui/empty-illustration.svg";
import Image from "next/image";

interface InvoiceListProps {
  filteredInvoices: Invoice[];
  loading: boolean;
  invoicesLoaded: boolean;
}

const InvoiceList = ({
  filteredInvoices,
  loading,
  invoicesLoaded,
}: InvoiceListProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-[32px] space-y-6">
      {loading ? (
        Array.from({ length: 30 }).map((_, index) => (
          <SkeletonInvoiceCard key={index} />
        ))
      ) : invoicesLoaded && filteredInvoices.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full w-full mt-24">
          <Image src={Placeholder} alt="No invoices found" />
          <h3 className="text-heading mt-20 font-bold text-3xl">
            There is nothing here
          </h3>
          <p className="text-center text-[#888EB0] dark:text-[#DFE3FA]">
            Create an invoice by clicking the <br />{" "}
            <span className="font-bold">New Invoice </span>
            button and get started
          </p>
        </div>
      ) : (
        filteredInvoices.map((invoice: Invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))
      )}
    </div>
  );
};

export default InvoiceList;
