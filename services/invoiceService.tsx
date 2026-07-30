"use client";

import { InvoiceFormSchemaType } from "@/components/InvoiceForm";
import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || undefined,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

export const getInvoices = async () => {
  try {
    const response = await api.get("/api/invoices");
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else if (error instanceof Error) {
      throw new Error(
        error.message || "An unknown error occurred during logout",
      );
    }
    throw new Error("An unknown error occurred during logout");
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    const response = await api.get(`/api/invoices/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    } else if (error instanceof Error) {
      throw new Error(
        error.message || "An unknown error occurred while fetching the invoice",
      );
    }
    throw new Error("An unknown error occurred while fetching the invoice");
  }
};

export const createInvoice = async (invoiceData: InvoiceFormSchemaType) => {
  try {
    const mappedData = {
      bill_from_street_address: invoiceData.bill_from_street_address,
      bill_from_city: invoiceData.bill_from_city,
      bill_from_postcode: invoiceData.bill_from_postcode,
      bill_from_country: invoiceData.bill_from_country,
      bill_to_email: invoiceData.bill_to_email,
      bill_to_name: invoiceData.bill_to_name,
      bill_to_street_address: invoiceData.bill_to_street_address,
      bill_to_city: invoiceData.bill_to_city,
      bill_to_postcode: invoiceData.bill_to_postcode,
      bill_to_country: invoiceData.bill_to_country,
      invoice_date: invoiceData.invoice_date.toISOString(),
      payment_terms: invoiceData.payment_terms,
      project_description: invoiceData.project_description,
      items: invoiceData.items.map((item) => ({
        item_description: item.item_description,
        item_quantity: item.item_quantity,
        item_price: parseFloat(item.item_price),
        item_total: item.item_quantity * parseFloat(item.item_price),
      })),
      status: invoiceData.status,
    };

    const response = await api.post("/api/invoices", mappedData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      throw new Error(
        error.message || "An unknown error occurred while creating the invoice",
      );
    }
    throw new Error("An unknown error occurred while creating the invoice");
  }
};

export const updateInvoice = async (
  id: string,
  invoiceData: InvoiceFormSchemaType,
) => {
  try {
    const mappedData = {
      bill_from_street_address: invoiceData.bill_from_street_address,
      bill_from_city: invoiceData.bill_from_city,
      bill_from_postcode: invoiceData.bill_from_postcode,
      bill_from_country: invoiceData.bill_from_country,
      bill_to_email: invoiceData.bill_to_email,
      bill_to_name: invoiceData.bill_to_name,
      bill_to_street_address: invoiceData.bill_to_street_address,
      bill_to_city: invoiceData.bill_to_city,
      bill_to_postcode: invoiceData.bill_to_postcode,
      bill_to_country: invoiceData.bill_to_country,
      invoice_date: new Date(invoiceData.invoice_date).toISOString(),
      payment_terms: invoiceData.payment_terms,
      project_description: invoiceData.project_description,
      items: invoiceData.items.map((item) => ({
        item_description: item.item_description,
        item_quantity: item.item_quantity,
        item_price: parseFloat(item.item_price),
        item_total: item.item_quantity * parseFloat(item.item_price),
      })),
      status: invoiceData.status,
    };

    const response = await api.put(`/api/invoices/${id}`, mappedData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      throw new Error(
        error.message || "An unknown error occurred while updating the invoice",
      );
    }
    throw new Error("An unknown error occurred while updating the invoice");
  }
};

export const updateInvoiceStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/api/invoices/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      throw new Error(
        error.message ||
          "An unknown error occurred while updating the invoice status",
      );
    }
    throw new Error(
      "An unknown error occurred while updating the invoice status",
    );
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    await api.delete(`/api/invoices/${id}`);
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      throw new Error(
        error.message || "An unknown error occurred while deleting the invoice",
      );
    }
    throw new Error("An unknown error occurred while deleting the invoice");
  }
};
