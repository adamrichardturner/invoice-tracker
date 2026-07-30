import { useState, useCallback, useRef } from "react";
import { getInvoices, getInvoiceById } from "@/services/invoiceService";
import { useInvoicesStore } from "@/stores/InvoicesState/useInvoicesStore";
import { useUIStore } from "@/stores/UIState/useUIStore";
import { FilterOption } from "@/stores/UIState/slices/filterSlice";

const PAGE_SIZE = 15;

const useInvoices = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoicesLoaded, setInvoicesLoaded] = useState(false);
  const isFetchingRef = useRef(false);

  const {
    invoices,
    nextCursor,
    hasMore,
    totalCount,
    setInvoicesPage,
    resetInvoices,
  } = useInvoicesStore((state) => ({
    invoices: state.invoices,
    nextCursor: state.nextCursor,
    hasMore: state.hasMore,
    totalCount: state.totalCount,
    setInvoicesPage: state.setInvoicesPage,
    resetInvoices: state.resetInvoices,
  }));

  const selectedFilters = useUIStore((state) => state.selectedFilters);

  const getSingleInvoice = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const invoice = await getInvoiceById(id);
      return invoice;
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        setError(
          fetchError.message ||
            "An unknown error occurred while fetching the invoice",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoicesPage = useCallback(
    async ({
      append,
      statuses,
      cursor,
    }: {
      append: boolean;
      statuses: FilterOption[];
      cursor?: string | null;
    }) => {
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const page = await getInvoices({
          cursor: append ? (cursor ?? null) : null,
          limit: PAGE_SIZE,
          statuses,
        });

        setInvoicesPage({
          invoices: page.data,
          nextCursor: page.nextCursor,
          hasMore: page.hasMore,
          totalCount: page.totalCount,
          append,
        });
        setInvoicesLoaded(true);
      } catch (fetchError) {
        if (fetchError instanceof Error) {
          setError(
            fetchError.message ||
              "An unknown error occurred while fetching invoices",
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [setInvoicesPage],
  );

  const fetchInvoices = useCallback(async () => {
    resetInvoices();
    await fetchInvoicesPage({
      append: false,
      statuses: selectedFilters,
    });
  }, [fetchInvoicesPage, resetInvoices, selectedFilters]);

  const fetchMoreInvoices = useCallback(async () => {
    if (!hasMore || !nextCursor || loading || loadingMore) {
      return;
    }

    await fetchInvoicesPage({
      append: true,
      statuses: selectedFilters,
      cursor: nextCursor,
    });
  }, [
    fetchInvoicesPage,
    hasMore,
    nextCursor,
    loading,
    loadingMore,
    selectedFilters,
  ]);

  return {
    invoices,
    loading,
    loadingMore,
    error,
    fetchInvoices,
    fetchMoreInvoices,
    getSingleInvoice,
    invoicesLoaded,
    hasMore,
    totalCount,
  };
};

export default useInvoices;
