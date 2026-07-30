"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  UseFormSetValue,
  Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetClose } from "../ui/sheet";
import { DatePicker } from "@/components/DatePicker";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FaTrash } from "react-icons/fa";
import { PaymentTermsDropdown } from "./PaymentTermsDropdown";
import { toast } from "sonner";
import { useInvoicesStore } from "@/stores/InvoicesState/useInvoicesStore";
import { useUIStore } from "@/stores/UIState/useUIStore";
import useSelectedInvoice from "@/hooks/invoices/useSelectedInvoice";

const InvoiceFormSchema = z.object({
  bill_from_street_address: z.string().min(1, "Street address is required"),
  bill_from_city: z.string().min(1, "City is required"),
  bill_from_postcode: z.string().min(1, "Post code is required"),
  bill_from_country: z.string().min(1, "Country is required"),
  bill_to_email: z.string().email("Invalid email format"),
  bill_to_name: z.string().min(1, "Client's name is required"),
  bill_to_street_address: z.string().min(1, "Street address is required"),
  bill_to_city: z.string().min(1, "City is required"),
  bill_to_postcode: z.string().min(1, "Post code is required"),
  bill_to_country: z.string().min(1, "Country is required"),
  invoice_date: z.date({
    required_error: "Invoice date is required.",
  }),
  payment_terms: z.enum(["Net 30 Days", "14 Days", "7 Days"]),
  project_description: z.string().min(1, "Project description is required"),
  items: z
    .array(
      z.object({
        item_description: z.string().min(1, "Item name is required"),
        item_quantity: z.number().positive("Quantity must be positive"),
        item_price: z
          .string()
          .refine((val) => !isNaN(parseFloat(val)), {
            message: "Must be a valid number",
          })
          .refine((val) => parseFloat(val) > 0, {
            message: "Price must be greater than 0",
          })
          .refine((val) => /^\d+(\.\d{0,2})?$/.test(val), {
            message: "Must be a number with up to two decimal places",
          }),
        item_total: z.number().default(0),
      }),
    )
    .min(1, "At least one item is required"),
  status: z.enum(["draft", "pending", "paid"]),
});

export type InvoiceFormSchemaType = z.infer<typeof InvoiceFormSchema>;

export function InvoiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"draft" | "pending">(
    "draft",
  );
  const selectedInvoice = useInvoicesStore((state) => state.selectedInvoice);
  const selectedEditorMode = useUIStore((state) => state.selectedEditorMode);
  const { updateSelectedInvoice, addInvoice } = useSelectedInvoice();
  const setSheetOpen = useUIStore((state) => state.setSheetOpen);

  const form = useForm<InvoiceFormSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(InvoiceFormSchema),
    defaultValues:
      selectedEditorMode === "edit" && selectedInvoice
        ? {
            ...selectedInvoice,
            invoice_date: new Date(selectedInvoice.invoice_date),
            items: selectedInvoice.items?.map((item) => ({
              ...item,
              item_total: parseFloat(item.item_total.toString()),
            })),
          }
        : {
            bill_from_street_address: "",
            bill_from_city: "",
            bill_from_postcode: "",
            bill_from_country: "",
            bill_to_email: "",
            bill_to_name: "",
            bill_to_street_address: "",
            bill_to_city: "",
            bill_to_postcode: "",
            bill_to_country: "",
            invoice_date: new Date(),
            payment_terms: "Net 30 Days",
            project_description: "",
            items: [
              {
                item_description: "",
                item_quantity: 1,
                item_price: "0",
                item_total: 0,
              },
            ],
            status: "draft",
          },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (
        name &&
        name.startsWith("items.") &&
        (name.endsWith("item_quantity") || name.endsWith("item_price"))
      ) {
        const index = parseInt(name.split(".")[1]);
        updateItemTotal(index, form.control, form.setValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: InvoiceFormSchemaType) => {
    setIsSubmitting(true);
    try {
      if (selectedEditorMode === "create") {
        data.status = submitStatus;
        await addInvoice(data);
      } else if (selectedEditorMode === "edit") {
        await updateSelectedInvoice(data);
      }
      setSheetOpen(false);
    } catch {
      toast("Failed to submit invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (value: string) => void },
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      field.onChange(value);
    }
  };

  const handlePopulateRandomData = () => {
    const randomData = generateRandomData();
    form.reset(randomData);
    randomData.items.forEach((_, index) => {
      updateItemTotal(index, form.control, form.setValue);
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 mb-8 sm:mb-0"
      >
        {selectedEditorMode === "create" && (
          <Button
            type="button"
            onClick={handlePopulateRandomData}
            className="bg-primary min-h-[48px] pt-[10px] w-full rounded-3xl text-white hover:text-white"
          >
            Populate with Random Data
          </Button>
        )}
        <div className="space-y-2">
          <div className="flex flex-col justify-start items-start space-y-3">
            <h3 className="text-primary font-semibold text-sm tracking-[-0.25px]">
              Bill From
            </h3>
            <FormField
              control={form.control}
              name="bill_from_street_address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    {...field}
                    error={Boolean(
                      form.formState.errors.bill_from_street_address,
                    )}
                  />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex flex-row gap-4 w-full md:w-auto">
                <FormField
                  control={form.control}
                  name="bill_from_city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <Input
                        {...field}
                        error={Boolean(form.formState.errors.bill_from_city)}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bill_from_postcode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Post Code</FormLabel>
                      <Input
                        {...field}
                        error={Boolean(
                          form.formState.errors.bill_from_postcode,
                        )}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4 w-full md:w-auto flex-auto">
                <FormField
                  control={form.control}
                  name="bill_from_country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <Input
                        {...field}
                        error={Boolean(form.formState.errors.bill_from_country)}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-primary font-semibold text-sm tracking-[-0.25px]">
            Bill To
          </h3>
          <FormField
            control={form.control}
            name="bill_to_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{"Client's Name"}</FormLabel>
                <Input
                  {...field}
                  error={Boolean(form.formState.errors.bill_to_name)}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bill_to_email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{"Client's Email"}</FormLabel>
                <Input
                  {...field}
                  error={Boolean(form.formState.errors.bill_to_email)}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bill_to_street_address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Street Address</FormLabel>
                <Input
                  {...field}
                  error={Boolean(form.formState.errors.bill_to_street_address)}
                />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex flex-row gap-4 w-full md:w-auto">
              <FormField
                control={form.control}
                name="bill_to_city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <Input
                      {...field}
                      error={Boolean(form.formState.errors.bill_to_city)}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bill_to_postcode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Post Code</FormLabel>
                    <Input
                      {...field}
                      error={Boolean(form.formState.errors.bill_to_postcode)}
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-4 w-full md:w-auto flex-auto">
              <FormField
                control={form.control}
                name="bill_to_country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Country</FormLabel>
                    <Input
                      {...field}
                      error={Boolean(form.formState.errors.bill_to_country)}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <DatePicker
                control={form.control}
                name="invoice_date"
                label="Invoice Date"
              />
            </div>
            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="payment_terms"
                render={() => (
                  <FormItem className="w-full flex items-start flex-col text-left">
                    <FormLabel className="mb-2">Payment Terms</FormLabel>
                    <PaymentTermsDropdown
                      control={form.control}
                      name="payment_terms"
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="project_description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Project Description</FormLabel>
                <Input
                  {...field}
                  error={Boolean(form.formState.errors.project_description)}
                />
              </FormItem>
            )}
          />
          <h3 className="text-primary pt-4 font-semibold text-sm tracking-[-0.25px]">
            Items
          </h3>
          {(fields ?? []).map((item, index) => (
            <div key={item.id} className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name={`items.${index}.item_description`}
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormLabel>Item Name</FormLabel>
                        <Input
                          {...field}
                          className="w-full"
                          error={Boolean(
                            form.formState.errors.items?.[index]
                              ?.item_description,
                          )}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <FormField
                    control={form.control}
                    name={`items.${index}.item_quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Qty.</FormLabel>
                        <Input
                          type="number"
                          className="flex items-center justify-center"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value));
                            updateItemTotal(index, form.control, form.setValue);
                          }}
                          min="1"
                          error={Boolean(
                            form.formState.errors.items?.[index]?.item_quantity,
                          )}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.item_price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Price</FormLabel>
                        <Input
                          type="text"
                          {...field}
                          onChange={(e) => {
                            handlePriceInput(e, field);
                            updateItemTotal(index, form.control, form.setValue);
                          }}
                          error={Boolean(
                            form.formState.errors.items?.[index]?.item_price,
                          )}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.item_total`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Total</FormLabel>
                        <Input
                          {...field}
                          readOnly
                          value={field.value.toFixed(2)}
                        />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-transparent hover:bg-transparent text-[#888EB0] mt-[20px] p-0 flex items-center justify-center"
                    disabled={fields.length <= 1}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({
                item_description: "",
                item_quantity: 1,
                item_price: "0",
                item_total: 0,
              })
            }
            className="bg-[#F9FAFE] dark:bg-[#252945] min-h-[48px] w-full rounded-3xl text-body hover:text-white"
          >
            + Add New Item
          </Button>
          {form.formState.errors.items && (
            <span className="text-destructive text-xs">
              At least one item is required
            </span>
          )}
        </div>

        {selectedEditorMode === "create" && (
          <div className="flex justify-between">
            <SheetClose>
              <div className="bg-[#F9FAFE] dark:bg-[#252945] cursor-pointer pt-[3px] transition-colors px-4 rounded-3xl text-[#7E88C3] dark:text-[#DFE3FA] font-semibold text-sm min-h-[48px] flex items-center">
                Discard
              </div>
            </SheetClose>

            <div className="flex space-x-3">
              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setSubmitStatus("draft");
                    form.handleSubmit(handleSubmit)();
                  }}
                  disabled={isSubmitting}
                  className="bg-[#373B53] dark:bg-[#373B53] pt-[10px] dark:text-white transition-colors cursor-pointer hover:bg-[#1E2139] hover:text-white px-4 rounded-3xl text-[#888EB0] font-semibold text-sm min-h-[48px] flex items-center"
                >
                  Save as Draft
                </Button>
              </div>

              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setSubmitStatus("pending");
                    form.handleSubmit(handleSubmit)();
                  }}
                  disabled={isSubmitting}
                  className="bg-primary-foreground pt-[10px] transition-colors px-4 rounded-3xl text-white font-semibold text-sm min-h-[48px] flex items-center sheet-close-button"
                >
                  Save & Send
                </Button>
              </div>
            </div>
          </div>
        )}
        {selectedEditorMode === "edit" && (
          <div className="flex justify-end space-x-3">
            <SheetClose>
              <div className="bg-[#F9FAFE] dark:bg-[#252945] cursor-pointer pt-[3px] transition-colors px-4 rounded-3xl text-[#7E88C3] dark:text-[#DFE3FA] font-semibold text-sm min-h-[48px] flex items-center">
                Cancel
              </div>
            </SheetClose>

            <div className="flex space-x-3 justify-end">
              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    form.handleSubmit(handleSubmit)();
                  }}
                  disabled={isSubmitting || !form.formState.isDirty}
                  className="bg-primary-foreground pt-[10px] transition-colors px-4 rounded-3xl text-white font-semibold text-sm min-h-[48px] flex items-center sheet-close-button"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}

// Helper Functions
function calculateItemTotal(quantity: number, price: string): number {
  const parsedPrice = parseFloat(price) || 0;
  return quantity * parsedPrice;
}

function updateItemTotal(
  index: number,
  control: Control<InvoiceFormSchemaType>,
  setValue: UseFormSetValue<InvoiceFormSchemaType>,
) {
  const quantity = Number(control._formValues.items[index].item_quantity) || 0;
  const price = control._formValues.items[index].item_price || "0";
  const total = calculateItemTotal(quantity, price);

  setValue(`items.${index}.item_total`, total);
}

function generateRandomData() {
  const randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    bill_from_street_address: "123 Random St",
    bill_from_city: "Randomville",
    bill_from_postcode: "12345",
    bill_from_country: "Randomland",
    bill_to_email: `client${randomNumber(1, 1000)}@example.com`,
    bill_to_name: "Random Client",
    bill_to_street_address: "456 Client Ave",
    bill_to_city: "Client City",
    bill_to_postcode: "67890",
    bill_to_country: "Clientland",
    invoice_date: new Date(),
    payment_terms: ["Net 30 Days", "14 Days", "7 Days"][randomNumber(0, 2)] as
      "Net 30 Days" | "14 Days" | "7 Days",
    project_description: "Random project description",
    items: [
      {
        item_description: "Random item",
        item_quantity: randomNumber(1, 10),
        item_price: (randomNumber(100, 1000) / 100).toFixed(2),
        item_total: 0,
      },
    ],
    status: "draft" as const,
  };
}
