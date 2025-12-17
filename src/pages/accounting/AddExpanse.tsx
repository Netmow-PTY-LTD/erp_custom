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
import { useAddExpenseMutation, useGetAllDebitHeadsQuery } from "@/store/features/accounting/accoutntingApiService";
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
import { useAppSelector } from "@/store/store";
import type { DebitHead } from "@/types/accounting.types";

/* ------------------ ZOD SCHEMA ------------------ */
const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  expense_date: z.string().min(1, "Date is required"),
  debit_head_id: z.number().optional(),
  description: z.string().optional(),
  //category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paidVia: z.string().min(1, "Paid Via is required"),
  reference: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

/* ------------------ PAGE ------------------ */
export default function AddExpensePage() {
  const [open, setOpen] = useState(false);
  const [page] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const navigate = useNavigate();
  const [addExpense, { isLoading }] = useAddExpenseMutation();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      expense_date: "",
      debit_head_id: 0,
      description: "",
      amount: 0,
      paidVia: "",
      reference: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const { data } = useGetAllDebitHeadsQuery({
      page,
      limit,
      search,
    });
    const debitHeads: DebitHead[] = data?.data || [];
  
    console.log("Debit Heads", debitHeads);
    const currency = useAppSelector((state) => state.currency.value);

  const onSubmit: SubmitHandler<ExpenseFormValues> = async (values) => {
    const payload = {
      title: values.title,
      expense_date: values.expense_date,
      debit_head_id: values.debit_head_id,
      description: values.description,
      amount: values.amount,
      payment_method: values.paidVia,
      reference_number: values.reference,
    }
    try {
      const res = await addExpense(payload).unwrap();
      if (res.status) {
        toast.success("Expense added successfully");
        reset(); // Clear form
        navigate("/dashboard/accounting/expenses"); // Redirect
      } else {
        toast.error("Failed to add expense");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while adding expense");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold">Add Expense</h1>

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
                  <Input placeholder="Expense Title" {...field} />
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
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="supplies">Supplies</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            /> */}

            <Controller
              control={control}
              name="debit_head_id"
              render={({ field, fieldState }) => {
                const selected = debitHeads?.find(
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
                          {selected ? selected.name : "Select debit head..."}
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
                            <CommandEmpty>No debit head found.</CommandEmpty>

                            <CommandGroup>
                              {debitHeads?.map((item) => (
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
              name="expense_date"
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
                      placeholder="Describe expense..."
                      {...field}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* PAYMENT DETAILS */}
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

            {/* PAID VIA */}
            <Controller
              control={control}
              name="paidVia"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Paid Via</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cash, Bank, etc." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Card Payment</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
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
                  <Input placeholder="Bill #, Txn ID, etc." {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Expense"}
          </Button>
        </div>
      </form>
    </div>
  );
}
