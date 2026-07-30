import { InvoiceItem } from "@/types/InvoiceItem";

interface InvoiceItemProps {
  invoiceItems: InvoiceItem[];
  invoiceTotal: number;
}

export default function InvoiceItemsSection({
  invoiceItems,
  invoiceTotal,
}: InvoiceItemProps) {
  const displayInvoiceItems = (invoiceItems ?? []).map((item, index) => (
    <InvoiceItemRow
      key={item.id ? String(item.id) : `${item.item_description}-${index}`}
      invoiceItem={item}
    />
  ));
  return (
    <>
      {/* Desktop Items */}
      <div className="hidden md:block bg-background dark:bg-[#252945] rounded-md">
        <div className="rounded-t-md px-8 pt-8 w-full flex mb-6">
          <div className="w-1/2">
            <span className="text-sm">Item Name</span>
          </div>
          <div className="w-1/2 text-right text-sm flex">
            <div className="w-1/3">Qty</div>
            <div className="w-1/3">Price</div>
            <div className="w-1/3">Total</div>
          </div>
        </div>
        <div className="pb-6">{displayInvoiceItems}</div>
        <div className="flex rounded-b-md justify-between px-8 py-8 bg-sidebarBg dark:bg-[#0C0E16] text-white">
          <span className="text-sm">Amount Due</span>
          <div className="text-xl font-bold">£ {invoiceTotal.toFixed(2)}</div>
        </div>
      </div>
      {/* Mobile Items */}
      <div className=" dark:bg-[#252945] rounded-md md:hidden">
        <div className="pb-4">{displayInvoiceItems}</div>
        <div className="flex rounded-b-md justify-between px-6 py-6 items-center bg-sidebarBg dark:bg-[#0C0E16] text-white">
          <span className="text-sm pt-[3px]">Amount Due</span>
          <div className="text-xl font-bold pt-[3px]">
            £&nbsp;{invoiceTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}

interface InvoiceItemRowProps {
  invoiceItem: InvoiceItem;
}

function InvoiceItemRow({ invoiceItem }: InvoiceItemRowProps) {
  return (
    <>
      {/* Desktop Item Row */}
      <div className="bg-background dark:bg-[#252945] font-bold rounded-t-lg px-8 py-1.5 w-full hidden md:flex">
        <div className="w-1/2">
          <span className="text-md text-heading">
            {invoiceItem.item_description}
          </span>
        </div>
        <div className="w-1/2 text-right text-sm flex">
          <div className="w-1/3">{invoiceItem.item_quantity}</div>
          <div className="w-1/3">
            <span>£&nbsp;</span>
            {invoiceItem.item_price}
          </div>
          <div className="w-1/3 text-heading">
            <span>£&nbsp;</span>
            {invoiceItem.item_total}
          </div>
        </div>
      </div>
      {/* Mobile Item Row */}
      <div className="md:hidden bg-background dark:bg-[#252945] font-bold justify-between items-center rounded-t-lg px-6 py-1.5 w-full flex">
        <div className="flex flex-col leading-tight">
          <span className="text-md text-heading">
            {invoiceItem.item_description}
          </span>
          <span className="text-sm">
            {invoiceItem.item_quantity}&nbsp;x £&nbsp;{invoiceItem.item_price}
          </span>
        </div>
        <div className="text-right text-sm flex">
          <div className="text-heading">
            <span>£&nbsp;</span>
            {invoiceItem.item_total}
          </div>
        </div>
      </div>
    </>
  );
}
