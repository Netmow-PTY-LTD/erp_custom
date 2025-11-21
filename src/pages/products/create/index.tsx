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

/* ------------------ ZOD SCHEMA ------------------ */
const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.string().nullable(),
  unit: z.string(),
  status: z.string(),
  unitPrice: z.coerce.number().nonnegative(),
  costPrice: z.coerce.number().nonnegative(),
  initialStock: z.coerce.number().int().nonnegative(),
  minStock: z.coerce.number().int().nonnegative(),
  maxStock: z.coerce.number().int().nonnegative(),
  weight: z.coerce.number().nonnegative(),
  dimensions: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

/* ------------------ PAGE ------------------ */
export default function AddProductPage() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      category: "",
      unit: "pcs",
      status: "active",
      unitPrice: 0,
      costPrice: 0,
      initialStock: 0,
      minStock: 0,
      maxStock: 0,
      weight: 0,
      dimensions: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit: SubmitHandler<ProductFormValues> = (values) => {
    console.log(values);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold">Add Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* SKU */}
            <Controller
              control={control}
              name="sku"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>SKU</FieldLabel>
                  <Input placeholder="SKU123" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* NAME */}
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Product name" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

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
                      placeholder="Write description..."
                      {...field}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* CLASSIFICATION */}
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            {/* CATEGORY */}
            <Controller
              control={control}
              name="category"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={field.value || "none"} // default to "none" if empty
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- None --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- None --</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* UNIT */}
            <Controller
              control={control}
              name="unit"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Unit</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">pcs</SelectItem>
                      <SelectItem value="box">box</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* STATUS */}
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* PRICING & STOCK */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Stock</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              ["unitPrice", "Unit Price (RM)"],
              ["costPrice", "Cost Price (RM)"],
              ["initialStock", "Initial Stock"],
              ["minStock", "Min Stock"],
              ["maxStock", "Max Stock"],
            ].map(([name, label]) => (
              <Controller
                key={name}
                control={control}
                name={name as keyof ProductFormValues}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{label}</FieldLabel>
                    <Input type="number" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            ))}
          </CardContent>
        </Card>

        {/* LOGISTICS */}
        <Card>
          <CardHeader>
            <CardTitle>Logistics</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* WEIGHT */}
            <Controller
              control={control}
              name="weight"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Weight (kg)</FieldLabel>
                  <Input type="number" step="0.01" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* DIMENSIONS */}
            <Controller
              control={control}
              name="dimensions"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Dimensions</FieldLabel>
                  <Input placeholder="10 x 5 x 2 cm" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </div>
  );
}
