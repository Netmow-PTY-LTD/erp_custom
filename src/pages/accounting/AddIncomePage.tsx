"use client";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  useAddIncomeMutation,
  useGetAllCreditHeadsQuery,
} from "@/store/features/accounting/accoutntingApiService";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { CreditHead } from "@/types/accounting.types";
import { useAppSelector } from "@/store/store";

/* ------------------ ZOD SCHEMA ------------------ */
const incomeSchema = z.object({
  title: z.string().min(1, "Required"),
  income_date: z.string().min(1, "Required"),
  credit_head_id: z.number().min(1, "Required"),
  description: z.string().optional(),
  //category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  receivedVia: z.string().optional(),
  reference: z.string().optional(),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

/* ------------------ PAGE ------------------ */
export default function AddIncomePage() {
  const [open, setOpen] = useState(false);
  const [page] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const navigate = useNavigate();
  const [addIncome, { isLoading }] = useAddIncomeMutation();

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      title: "",
      income_date: "",
      credit_head_id: 0,
      description: "",
      amount: 0,
      receivedVia: "",
      reference: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const { data } = useGetAllCreditHeadsQuery({
    page,
    limit,
    search,
  });
  const creditHeads: CreditHead[] = data?.data || [];

  console.log("Debit Heads", data);
  const currency = useAppSelector((state) => state.currency.value);

  const onSubmit: SubmitHandler<IncomeFormValues> = async (values) => {
    console.log("Income Form Values", values);
    const payload = {
      title: values.title,
      income_date: values.income_date,
      credit_head_id: values.credit_head_id,
      description: values.description,
      amount: values.amount,
      payment_method: values.receivedVia,
      reference_number: values.reference,
    }
    try {
      const res = await addIncome(payload).unwrap();
      if (res.status) {
        toast.success("Income added successfully");
        reset(); // Clear the form
        navigate("/dashboard/accounting/incomes"); // Go back to previous page
      } else {
        toast.error("Failed to add income");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while adding income");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold">Add Income</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* TITLE */}
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input placeholder="Income Title" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            {/* CATEGORY */}
            {/* <Controller
              control={control}
              name="category"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="interest">Interest</SelectItem>
                      <SelectItem value="service">Service Income</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            /> */}

            <Controller
              control={control}
              name="credit_head_id"
              render={({ field, fieldState }) => {
                const selected = creditHeads?.find(
                  (item) => Number(item.id) === Number(field.value)
                );

                return (
                  <Field>
                    <FieldLabel>Credit Head</FieldLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {selected ? selected.name : "Select credit head..."}
                          <ChevronDown className="opacity-50 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-full p-0">
                        <Command>
                          {/* Search input */}
                          <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                            value={search}
                            onValueChange={setSearch}
                          />

                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>

                            <CommandGroup>
                              {creditHeads?.map((item) => (
                                <CommandItem
                                  key={item.id}
                                  value={`${item.name}-${item.id}`} // unique, string
                                  onSelect={() => {
                                    field.onChange(item.id); // convert back to number
                                    setOpen(false);
                                  }}
                                >
                                  {item.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      Number(field.value) === Number(item.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                );
              }}
            />
            {/* DATE */}
            <div className="md:col-span-2">
              <Controller
                control={control}
                name="income_date"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Date</FieldLabel>
                    <Input type="date" {...field} className="block" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      rows={4}
                      placeholder="Describe income..."
                      {...field}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* PAYMENT INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* AMOUNT */}
            <Controller
              control={control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Amount ({currency})</FieldLabel>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* RECEIVED VIA */}
            <Controller
              control={control}
              name="receivedVia"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Payment Method</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cash, Bank, etc." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Card Payment</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* REFERENCE */}
            <Controller
              control={control}
              name="reference"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Reference</FieldLabel>
                  <Input placeholder="Invoice #, Txn ID, etc." {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Income"}
          </Button>
        </div>
      </form>
    </div>
  );
}
