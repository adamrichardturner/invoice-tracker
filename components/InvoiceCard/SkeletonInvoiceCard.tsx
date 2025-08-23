// components/SkeletonInvoiceCard/SkeletonInvoiceCard.tsx
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonInvoiceCard = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-invoiceCard rounded-md flex justify-between items-center py-[30px] px-4 h-[150px] md:h-[72px] shadow-md border border-transparent"
    >
      {/* Desktop layout */}
      <div className="hidden md:flex flex-row items-center w-full flex-1 justify-center h-full pl-4">
        {/* #id */}
        <Skeleton className="h-4 w-[46px] mr-6 bg-muted/40 dark:bg-muted/20" />
        {/* Due date */}
        <Skeleton className="h-4 w-[120px] mr-6 bg-muted/40 dark:bg-muted/20" />
        {/* Name */}
        <Skeleton className="h-4 w-[160px] mr-6 bg-muted/40 dark:bg-muted/20" />
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col items-center justify-start w-full pl-2 space-y-4">
        {/* Row: #id */}
        <div className="flex justify-start w-full items-start">
          <Skeleton className="h-4 w-[60px] bg-muted/40 dark:bg-muted/20" />
        </div>
        {/* Row: due + amount */}
        <div className="flex flex-col w-full items-start">
          <Skeleton className="h-3 w-[130px] mb-2 bg-muted/40 dark:bg-muted/20" />
          <Skeleton className="h-4 w-[100px] bg-muted/40 dark:bg-muted/20" />
        </div>
      </div>

      {/* Right side (amount + status + chevron) */}
      <div className="text-right hidden md:flex items-center">
        {/* Amount */}
        <Skeleton className="h-4 w-[90px] mr-6 bg-muted/40 dark:bg-muted/20" />

        {/* Status pill mimic */}
        <div className="relative px-4 py-1 w-[106px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-md opacity-40 bg-muted/30 dark:bg-muted/20" />
          <div className="relative flex items-center">
            <Skeleton className="h-2 w-2 rounded-full mr-2 bg-muted/40 dark:bg-muted/25" />
            <Skeleton className="h-3 w-[60px] bg-muted/40 dark:bg-muted/20" />
          </div>
        </div>

        {/* Chevron */}
        <Skeleton className="h-5 w-5 ml-4 rounded-full bg-muted/40 dark:bg-muted/20" />
      </div>

      {/* Mobile right side */}
      <div className="text-right flex flex-col md:hidden items-center space-y-4 pr-2">
        {/* Name */}
        <Skeleton className="h-4 w-[140px] bg-muted/40 dark:bg-muted/20" />
        {/* Status pill mimic */}
        <div className="relative inline-flex items-center justify-center w-[138px] h-[40px]">
          <div className="absolute inset-0 rounded-md opacity-40 bg-muted/30 dark:bg-muted/20" />
          <Skeleton className="h-3 w-[60px] bg-muted/40 dark:bg-muted/20" />
        </div>
      </div>

      <span className="sr-only">Loading invoice…</span>
    </div>
  );
};
