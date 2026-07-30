"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Invoice } from "@/types/Invoice";
import { InvoiceCard } from "../InvoiceCard/InvoiceCard";
import { SkeletonInvoiceCard } from "../InvoiceCard/SkeletonInvoiceCard";
import Placeholder from "@/assets/ui/empty-illustration.svg";
import Image from "next/image";

interface InvoiceListProps {
  filteredInvoices: Invoice[];
  loading: boolean;
  loadingMore: boolean;
  invoicesLoaded: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const listItemVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    x: -28,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
};

const InvoiceList = ({
  filteredInvoices,
  loading,
  loadingMore,
  invoicesLoaded,
  hasMore,
  onLoadMore,
}: InvoiceListProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }
        onLoadMore();
      },
      {
        root: null,
        rootMargin: "240px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, loading, loadingMore]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-[32px] space-y-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonInvoiceCard key={index} />
        ))}
      </div>
    );
  }

  if (invoicesLoaded && filteredInvoices.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-[32px] space-y-6">
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
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-[32px] space-y-6">
      <AnimatePresence mode="popLayout" initial={false}>
        {filteredInvoices.map((invoice: Invoice) => (
          <motion.div
            key={invoice.id}
            layout
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <InvoiceCard invoice={invoice} />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {loadingMore ? (
          <motion.div
            key="loading-more"
            className="w-full flex flex-col space-y-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonInvoiceCard key={`more-${index}`} />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {hasMore ? (
        <div ref={sentinelRef} className="h-4 w-full" aria-hidden />
      ) : null}
    </div>
  );
};

export default InvoiceList;
