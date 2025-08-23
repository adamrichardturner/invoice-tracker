"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores/UIState/useUIStore";
import { FilterOption } from "@/stores/UIState/slices/filterSlice";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export function InvoiceFilter({ disabled = false }: { disabled?: boolean }) {
  const { selectedFilters, toggleFilter } = useUIStore((state) => ({
    selectedFilters: state.selectedFilters,
    toggleFilter: state.toggleFilter,
  }));

  const isChecked = (filter: FilterOption) => selectedFilters.includes(filter);

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <DropdownMenu
      open={disabled ? false : menuOpen}
      onOpenChange={disabled ? () => {} : setMenuOpen}
    >
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={disabled}
        >
          <span className="hidden md:block text-heading text-md tracking-[-0.25px] font-bold">
            Filter by status
          </span>
          <span className="md:hidden text-heading text-md tracking-[-0.25px] font-bold">
            Filter
          </span>
          {menuOpen && !disabled ? (
            <MdKeyboardArrowUp className="ml-2 font-bold text-primary text-lg" />
          ) : (
            <MdKeyboardArrowDown className="ml-2 font-bold text-primary text-lg" />
          )}
        </button>
      </DropdownMenuTrigger>
      {!disabled && (
        <DropdownMenuContent
          className="w-[192px] dark:bg-sidebarBg"
          side="bottom"
          align="center"
          sideOffset={20}
        >
          <DropdownMenuCheckboxItem
            checked={isChecked("draft")}
            onCheckedChange={() => toggleFilter("draft")}
          >
            Draft
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isChecked("pending")}
            onCheckedChange={() => toggleFilter("pending")}
          >
            Pending
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isChecked("paid")}
            onCheckedChange={() => toggleFilter("paid")}
          >
            Paid
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
