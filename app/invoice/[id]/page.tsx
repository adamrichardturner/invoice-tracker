"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useInvoicesStore } from "@/stores/InvoicesState/useInvoicesStore";
import { getInvoiceById } from "@/services/invoiceService";
import InvoiceSingleNav from "@/components/InvoiceSingle/InvoiceSingleNav/InvoiceSingleNav";
import BackButton from "@/components/BackButton/BackButton";
import { Invoice } from "@/types/Invoice";
import InvoiceDetail from "@/components/InvoiceDetail/InvoiceDetail";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function InvoicePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const setSelectedInvoice = useInvoicesStore(
    (state) => state.setSelectedInvoice,
  );
  const selectedInvoice = useInvoicesStore((state) => state.selectedInvoice);

  useEffect(() => {
    let isCancelled = false;

    async function fetchInvoice() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const invoice: Invoice = await getInvoiceById(id);
        if (isCancelled) {
          return;
        }
        setSelectedInvoice(invoice);
      } catch (error) {
        if (isCancelled) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Failed to load invoice";
        setFetchError(message);
        setSelectedInvoice(undefined);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchInvoice();

    return () => {
      isCancelled = true;
    };
  }, [id, setSelectedInvoice]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen md:ml-[103px] items-start pt-[120px] md:pt-[65px] pb-[56px] md:pb-0 justify-center">
        <Sidebar />
        <main className="flex flex-col h-full w-full md:w-[768px] items-center justify-center mx-4">
          <div>Loading invoice...</div>
        </main>
      </div>
    );
  }

  if (fetchError || !selectedInvoice) {
    return (
      <div className="flex min-h-screen md:ml-[103px] items-start pt-[120px] md:pt-[65px] pb-[56px] md:pb-0 justify-center">
        <Sidebar />
        <main className="flex flex-col h-full w-full md:w-[768px] items-center justify-center mx-4">
          <BackButton path="/" />
          <div>{fetchError ?? "Invoice not found"}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen md:ml-[103px] items-start pt-[120px] md:pt-[65px] pb-[56px] md:pb-0 justify-center">
      <Sidebar />
      <main className="flex flex-col h-full w-full md:w-[768px] items-center justify-center mx-4">
        <BackButton path="/" />
        <InvoiceSingleNav invoice={selectedInvoice} />
        <InvoiceDetail invoice={selectedInvoice} />
      </main>
    </div>
  );
}
