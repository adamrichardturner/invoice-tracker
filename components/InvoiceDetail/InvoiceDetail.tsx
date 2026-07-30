"use client";

import { Invoice } from "@/types/Invoice";
import { addDaysToDateFromTerm } from "@/utils/addDaysToDate";
import InvoiceItemsSection from "./InvoiceItemsSection";

interface InvoiceDetailProps {
  invoice: Invoice;
}

export default function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const { invoiceDue, invoiceDate } = addDaysToDateFromTerm(
    invoice.invoice_date,
    invoice.payment_terms,
  );
  return (
    <div className="bg-white dark:text-[#DFE3FA] dark:bg-[#1E2139] text-body mt-6 mb-[88px] md:mb-4 w-full flex flex-col px-6 py-4 md:px-12 md:pt-8 md:pb-12 rounded-lg shadow-md space-y-8">
      <div className="pt-6 flex flex-col md:flex-row items-start md:justify-between w-full">
        <div className="flex flex-col">
          <div className="font-bold text-heading">
            <span className="text-[#888EB0]">#&nbsp;</span>
            {invoice.id}
          </div>
          <span className="text-sm">{invoice.project_description}</span>
        </div>
        <div className="text-sm flex flex-col md:text-right py-8 md:py-0 leading-tight">
          <span>{invoice.bill_from_street_address}</span>
          <span>{invoice.bill_from_city}</span>
          <span>{invoice.bill_from_postcode}</span>
          <span>{invoice.bill_from_country}</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:mb-6">
        <div className="flex w-full md:w-2/3">
          <div className="flex flex-col w-1/2 h-full items-between justify-between">
            <div className="flex flex-col">
              <span className="text-sm">Invoice Date</span>
              <span className="text-heading font-bold pt-3">{invoiceDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Payment Due</span>
              <span className="text-heading font-bold pt-3">{invoiceDue}</span>
            </div>
          </div>
          <div className="flex flex-col w-1/2">
            <span className="text-sm">Bill To</span>
            <span className="text-heading font-bold pt-3">
              {invoice.bill_to_name}
            </span>
            <div className="flex flex-col text-sm leading-tight">
              <span>{invoice.bill_to_street_address}</span>
              <span>{invoice.bill_to_city}</span>
              <span>{invoice.bill_to_postcode}</span>
              <span>{invoice.bill_to_country}</span>
            </div>
          </div>
        </div>
        <div className="pt-4 md:pt-0 md:w-1/2 flex flex-col">
          <span className="text-sm">Sent to</span>
          <span className="text-heading font-bold pt-3">
            {invoice.bill_to_email}
          </span>
        </div>
      </div>
      <div className="pt-4 md:pt-0 bg-background dark:bg-[#252945] rounded-lg">
        <InvoiceItemsSection
          invoiceItems={invoice.items}
          invoiceTotal={invoice.invoice_total}
        />
      </div>
    </div>
  );
}
