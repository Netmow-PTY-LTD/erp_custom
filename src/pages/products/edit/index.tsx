"use client";

import { Controller, useForm } from "react-hook-form";
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
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ImageUploader } from "@/components/form/ImageUploader";
import {
  useGetAllCategoriesQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/features/admin/productsApiService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";

/* ------------------ ZOD SCHEMA ------------------ */
const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.number(),
  unit: z.number(),
  price: z.number(),
  costPrice: z.number(),
  initialStock: z.number(),
  minStock: z.number(),
  maxStock: z.number(),
  weight: z.number(),
  width: z.number(),
  height: z.number(),
  length: z.number(),
  is_active: z.boolean().optional(),
  image: z.instanceof(File).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type NumericFieldNames =
  | "price"
  | "costPrice"
  | "initialStock"
  | "minStock"
  | "maxStock";

type NumericFieldTuple = [NumericFieldNames, string];

const numericFields: NumericFieldTuple[] = [
  ["price", "Price (RM)"],
  ["costPrice", "Cost Price (RM)"],
  ["initialStock", "Initial Stock"],
  ["minStock", "Min Stock"],
  ["maxStock", "Max Stock"],
];

/* ------------------ PAGE ------------------ */
export default function EditProductPage() {
  const productId = useParams().productId;
  console.log("Editing Product ID:", productId);

  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  // const limit = 10;
  const { data: fetchedCategories } = useGetAllCategoriesQuery({
    search,
  });

  console.log("Fetched Categories: ", fetchedCategories);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      category: 0,
      unit: 0,
      price: 0,
      costPrice: 0,
      initialStock: 0,
      minStock: 0,
      maxStock: 0,
      weight: 0,
      width: 0,
      height: 0,
      length: 0,
      is_active: true,
    },
  });

  const { control, handleSubmit } = form;

  const { data: fetchedProduct } = useGetProductByIdQuery(Number(productId), {
    skip: !Number(productId),
  });

  console.log("Product Data: ", fetchedProduct);

  useEffect(() => {
    if (fetchedProduct?.data) {
      form.reset({
        sku: fetchedProduct.data.sku,
        name: fetchedProduct.data.name,
        description: fetchedProduct.data.description,
        category: fetchedProduct.data.category_id,
        unit: fetchedProduct.data.unit_id,
        price: fetchedProduct.data.price,
        costPrice: fetchedProduct.data.cost,
        initialStock: fetchedProduct.data.stock_quantity,
        minStock: fetchedProduct.data.min_stock_level,
        maxStock: fetchedProduct.data.max_stock_level,
        weight: fetchedProduct.data.weight,
        width: fetchedProduct.data.width,
        height: fetchedProduct.data.height,
        length: fetchedProduct.data.length,
        is_active: fetchedProduct.data.is_active,
      });
    }
  }, [fetchedProduct?.data, form]);

  const [updateProduct] = useUpdateProductMutation();
  const onSubmit = async (values: ProductFormValues) => {
    console.log(values);

    const payload = {
      sku: values.sku,
      name: values.name,
      description: values.description,
      category_id: Number(values.category),
      unit_id: Number(values.unit),
      price: Number(values.costPrice),
      cost: Number(values.costPrice),
      stock_quantity: Number(values.initialStock),
      min_stock: Number(values.minStock),
      max_stock: Number(values.maxStock),
      weight: Number(values.weight),
      width: Number(values.width),
      height: Number(values.height),
      length: Number(values.length),
      barcode: "9876543210987",
      is_active: values.is_active,
    };

    try {
      const res = await updateProduct({
        id: Number(productId),
        body: payload,
      }).unwrap();
      console.log("Product added successfully:", res);
      if (res.status) {
        toast.success("Product added successfully");
        // Navigate back to products list or reset form
        navigate("/dashboard/products");
      } else {
        toast.error("Failed to add product: " + res.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
      if (error instanceof Error) {
        toast.error("Failed to add product: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Link to="/dashboard/products">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>

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
            <div className="md:col-span-2">
              <Controller
                control={control}
                name="image"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
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
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                      {/* Search input outside of scrollable items */}
                      <div className="p-2 sticky top-0 bg-white z-10">
                        <Input
                          placeholder="Search categories..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {fetchedCategories?.data?.length ? (
                          fetchedCategories.data.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div>No category found</div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>

                  <FieldError>{fieldState?.error?.message}</FieldError>
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
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">pcs</SelectItem>
                      <SelectItem value="2">box</SelectItem>
                      <SelectItem value="3">kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* STATUS */}
            <Controller
              control={control}
              name="is_active"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(v === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
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
            {numericFields.map(([name, label]) => (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{label}</FieldLabel>
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
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* Width */}
            <Controller
              control={control}
              name="width"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Width(cm)</FieldLabel>
                  <Input placeholder="e.g. 2 cm" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          
              {/* heigh */}
            <Controller
              control={control}
              name="height"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Height(cm)</FieldLabel>
                  <Input placeholder="e.g. 2 cm" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
              {/* Width */}
            <Controller
              control={control}
              name="length"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Length(cm)</FieldLabel>
                  <Input placeholder="e.g. 2 cm" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button type="submit">Update Product</Button>
        </div>
      </form>
    </div>
  );
}
