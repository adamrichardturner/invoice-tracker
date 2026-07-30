import { useInvoicesStore } from "@/stores/InvoicesState/useInvoicesStore";

const useFilteredInvoices = () => {
  const invoices = useInvoicesStore((state) => state.invoices);

  return {
    filteredInvoices: invoices,
  };
};

export default useFilteredInvoices;
