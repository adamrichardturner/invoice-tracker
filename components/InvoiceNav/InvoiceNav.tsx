"use client";

import { InvoiceFilter } from "./InvoiceFilter/InvoiceFilter";
import OvalPlus from "@/assets/ui/oval-plus.svg";
import { useUIStore } from "@/stores/UIState/useUIStore";
import Image from "next/image";

interface InvoiceNavProps {
  invoiceTotal: number;
  loading?: boolean;
}

export default function InvoiceNav({
  invoiceTotal,
  loading = false,
}: InvoiceNavProps) {
  const { setSheetOpen, setSelectedEditorMode } = useUIStore((state) => ({
    setSheetOpen: state.setSheetOpen,
    setSelectedEditorMode: state.setSelectedEditorMode,
  }));

  const handleToggleSheet = () => {
    if (loading) {
      return;
    }
    setSelectedEditorMode("create");
    setSheetOpen(true);
  };
  return (
    <div className="flex flex-row w-full justify-between text-black">
      <div>
        <h2 className="text-heading text-2xl md:text-4xl font-bold tracking-[-1.13px]">
          Invoices
        </h2>
        <div className="flex h-[20px] flex-row items-center space-x-2">
          {!loading && (
            <p className="text-body text-sm text-[#888EB0] dark:text-[#DFE3FA]">
              {invoiceTotal} invoices
            </p>
          )}
        </div>
      </div>
      <div className="flex items-start space-x-6">
        <div className="flex space-x-4 md:space-x-6">
          <InvoiceFilter disabled={loading} />
          <button
            className="cursor-pointer flex items-center transition-colors justify-between space-x-3 bg-primary hover:bg-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed leading-none text-white pl-2 pr-4 py-2 rounded-3xl"
            onClick={handleToggleSheet}
            disabled={loading}
          >
            <Image src={OvalPlus} width={32} height={32} alt="Plus Button" />
            <div className="flex items-center leading-tight text-[14px] justify-start align-middle font-[600]">
              <span className="hidden md:block">New Invoice</span>
              <span className="md:hidden">New</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
