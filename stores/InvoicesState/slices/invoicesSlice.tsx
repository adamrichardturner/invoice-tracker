import { Invoice, InvoiceStatus } from "@/types/Invoice";
import { StateCreator } from "zustand";

export interface IInvoicesSlice {
  invoices: Invoice[];
  selectedInvoice?: Invoice;
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  setInvoicesPage: (payload: {
    invoices: Invoice[];
    nextCursor: string | null;
    hasMore: boolean;
    totalCount: number;
    append: boolean;
  }) => void;
  resetInvoices: () => void;
  addSingleInvoice: (invoice: Invoice) => void;
  setSelectedInvoice: (invoice: Invoice | undefined) => void;
  updateInvoice: (updatedInvoice: Invoice) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
}

export const createInvoicesSlice: StateCreator<IInvoicesSlice> = (set) => ({
  invoices: [],
  nextCursor: null,
  hasMore: false,
  totalCount: 0,
  setInvoicesPage: ({ invoices, nextCursor, hasMore, totalCount, append }) =>
    set((state) => {
      if (!append) {
        return {
          invoices,
          nextCursor,
          hasMore,
          totalCount,
        };
      }

      const existingIds = new Set(state.invoices.map((invoice) => invoice.id));
      const uniqueIncoming = invoices.filter(
        (invoice) => !existingIds.has(invoice.id),
      );

      return {
        invoices: [...state.invoices, ...uniqueIncoming],
        nextCursor,
        hasMore,
        totalCount,
      };
    }),
  resetInvoices: () =>
    set(() => ({
      invoices: [],
      nextCursor: null,
      hasMore: false,
      totalCount: 0,
    })),
  addSingleInvoice: (invoice: Invoice) =>
    set((state) => ({
      invoices: [invoice, ...state.invoices],
      totalCount: state.totalCount + 1,
    })),
  setSelectedInvoice: (invoice: Invoice | undefined) =>
    set(() => ({
      selectedInvoice: invoice,
    })),
  updateInvoice: (updatedInvoice: Invoice) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice,
      ),
      selectedInvoice:
        state.selectedInvoice?.id === updatedInvoice.id
          ? updatedInvoice
          : state.selectedInvoice,
    })),
  updateInvoiceStatus: (id: string, status: InvoiceStatus) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status } : invoice,
      ),
      selectedInvoice:
        state.selectedInvoice?.id === id
          ? { ...state.selectedInvoice, status }
          : state.selectedInvoice,
    })),
  deleteInvoice: (id: string) =>
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
      selectedInvoice:
        state.selectedInvoice?.id === id ? undefined : state.selectedInvoice,
      totalCount: Math.max(0, state.totalCount - 1),
    })),
});
