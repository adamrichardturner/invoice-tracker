import { useState, useCallback } from "react";
import { useInvoicesStore } from "@/stores/InvoicesState/useInvoicesStore";
import {
  updateInvoice,
  deleteInvoice,
  createInvoice,
  updateInvoiceStatus,
} from "@/services/invoiceService";
import { InvoiceFormSchemaType } from "@/components/InvoiceForm";
import { Invoice, InvoiceStatus } from "@/types/Invoice";
import { toast } from "sonner";

const useSelectedInvoice = () => {
  const {
    addSingleInvoice,
    selectedInvoice,
    setSelectedInvoice,
    updateInvoice: updateInvoiceInStore,
    updateInvoiceStatus: updateInvoiceStatusInStore,
    deleteInvoice: deleteInvoiceInStore,
  } = useInvoicesStore((state) => ({
    addSingleInvoice: state.addSingleInvoice,
    selectedInvoice: state.selectedInvoice,
    setSelectedInvoice: state.setSelectedInvoice,
    updateInvoice: state.updateInvoice,
    updateInvoiceStatus: state.updateInvoiceStatus,
    deleteInvoice: state.deleteInvoice,
  }));

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const addInvoice = useCallback(
    async (invoiceData: InvoiceFormSchemaType) => {
      setError(null);
      setLoading(true);
      try {
        const newInvoice = await createInvoice(invoiceData);
        addSingleInvoice(newInvoice);
        toast.success("Invoice created");
        setSuccess(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(
            error.message ||
              "An unknown error occurred while creating an invoice",
          );
          toast("Error creating invoice");
        }
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [addSingleInvoice],
  );

  const updateSelectedInvoiceStatus = useCallback(
    async (status: InvoiceStatus) => {
      if (!selectedInvoice) {
        setError("No invoice selected");
        return;
      }

      setLoading(true);
      try {
        const updatedInvoice = await updateInvoiceStatus(
          selectedInvoice.id,
          status,
        );
        setSelectedInvoice(updatedInvoice);
        updateInvoiceStatusInStore(selectedInvoice.id, status);
        setSuccess(true);
        setError(null);
        toast.success("Invoice status updated successfully");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [selectedInvoice, setSelectedInvoice, updateInvoiceStatusInStore],
  );

  const updateSelectedInvoice = useCallback(
    async (invoiceData: InvoiceFormSchemaType) => {
      if (!selectedInvoice) {
        setError("No invoice selected");
        return;
      }

      setLoading(true);
      try {
        const updatedInvoice: Invoice = await updateInvoice(
          selectedInvoice.id,
          invoiceData,
        );
        setSelectedInvoice(updatedInvoice);
        updateInvoiceInStore(updatedInvoice);
        setSuccess(true);
        setError(null);
        toast.info("Invoice updated successfully");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [selectedInvoice, setSelectedInvoice, updateInvoiceInStore],
  );

  const deleteSelectedInvoice = useCallback(async () => {
    if (!selectedInvoice) {
      setError("No invoice selected");
      return;
    }

    setLoading(true);
    try {
      await deleteInvoice(selectedInvoice.id);
      deleteInvoiceInStore(selectedInvoice.id);
      setSelectedInvoice(undefined);
      setSuccess(true);
      setError(null);
      toast.error("Invoice deleted");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [selectedInvoice, deleteInvoiceInStore, setSelectedInvoice]);

  const selectInvoice = useCallback(
    (invoice: Invoice) => {
      setSelectedInvoice(invoice);
    },
    [setSelectedInvoice],
  );

  return {
    selectInvoice,
    selectedInvoice,
    addInvoice,
    updateSelectedInvoiceStatus,
    updateSelectedInvoice,
    deleteSelectedInvoice,
    error,
    success,
    loading,
  };
};

export default useSelectedInvoice;
