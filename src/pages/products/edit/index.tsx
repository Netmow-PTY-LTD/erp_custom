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
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useGetAllUnitsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/features/admin/productsApiService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ImageUploaderPro from "@/components/form/ImageUploaderPro";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
  image: z.string().optional(),
  gallery_items: z.array(z.string()).optional(),
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
  const [open, setOpen] = useState(false);
  const [page] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [unitSearch, setUnitSearch] = useState<string>("");
  const limit = 10;
  const navigate = useNavigate();
  const { data: fetchedCategories } = useGetAllCategoriesQuery({
    page,
    limit,
    search,
  });

  // console.log("Fetched Categories: ", fetchedCategories);

  //const categories: any[] = fetchedCategories?.data || [];

  const { data: fetchedUnits } = useGetAllUnitsQuery({
    search: unitSearch,
  });

  const productId = useParams().productId;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      image: "",
      gallery_items: [],
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
        sku: fetchedProduct?.data?.sku,
        name: fetchedProduct?.data?.name,
        image: fetchedProduct?.data?.thumb_url,
        gallery_items: fetchedProduct?.data?.gallery_items,
        description: fetchedProduct?.data?.description,
        category: fetchedProduct?.data?.category_id,
        unit: fetchedProduct?.data?.unit_id,
        price: fetchedProduct?.data?.price || 0,
        costPrice: fetchedProduct?.data?.cost || 0,
        initialStock: fetchedProduct?.data?.initial_stock || 0,
        minStock: fetchedProduct?.data?.min_stock_level || 0,
        maxStock: fetchedProduct?.data?.max_stock_level || 0,
        weight: fetchedProduct?.data?.weight || 0,
        width: fetchedProduct?.data?.width || 0,
        height: fetchedProduct?.data?.height || 0,
        length: fetchedProduct?.data?.length || 0,
        is_active: fetchedProduct?.data?.is_active,
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
      thumb_url: values.image,
      gallery_items: values.gallery_items,
      category_id: Number(values.category),
      unit_id: Number(values.unit),
      price: Number(values.costPrice),
      cost: Number(values.costPrice),
      initial_stock: Number(values.initialStock),
      // stock_quantity: Number(values.initialStock),
      min_stock_level: Number(values.minStock),
      max_stock_level: Number(values.maxStock),
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
      <Form {...form}>
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
                      <ImageUploaderPro
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

          <Card>
            <CardContent>
              <Controller
                control={control}
                name="gallery_items"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Product Gallery</FieldLabel>
                    <ImageUploaderPro
                      value={field.value || []}
                      onChange={field.onChange}
                      multiple
                    />
                    <FieldError>{fieldState?.error?.message}</FieldError>
                  </Field>
                )}
              />
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
                render={({ field, fieldState }) => {
                  const selected = fetchedCategories?.data?.find(
                    (cat) => Number(cat.id) === Number(field.value) // FIX HERE
                  );

                  return (
                    <Field>
                      <FieldLabel>Category</FieldLabel>

                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selected ? selected.name : "Select category..."}
                            <ChevronDown className="opacity-50 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search category..."
                              value={search}
                              onValueChange={setSearch}
                            />

                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>

                              <CommandGroup>
                                {fetchedCategories?.data?.map((cat) => (
                                  <CommandItem
                                    key={cat.id}
                                    value={`${cat.id}-${cat.name}`}
                                    onSelect={() => {
                                      field.onChange(Number(cat.id)); // store as number
                                      setOpen(false);
                                    }}
                                  >
                                    {cat.name}

                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        Number(field.value) === cat.id
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

              {/* UNIT */}
              <Controller
                control={control}
                name="unit"
                render={({ field, fieldState }) => {
                  const selectedUnit = fetchedUnits?.data?.find(
                    (u) => u.id === field.value
                  );

                  const selectedLabel = selectedUnit?.name ?? "Select a unit";

                  return (
                    <Field>
                      <FieldLabel>Unit</FieldLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedLabel}
                            <ChevronDown className="opacity-50 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                          <Command>
                            {/* 🔍 Search input inside the popover */}
                            <CommandInput
                              placeholder="Search units..."
                              value={unitSearch}
                              onValueChange={setUnitSearch}
                            />

                            <CommandList>
                              <CommandEmpty>No units found.</CommandEmpty>

                              <CommandGroup>
                                {fetchedUnits?.data?.map((unit) => (
                                  <CommandItem
                                    key={unit.id}
                                    value={unit.name} // for built-in filtering
                                    onSelect={() => field.onChange(unit.id)}
                                  >
                                    <span>{unit.name}</span>

                                    {field.value === unit.id && (
                                      <Check className="ml-auto h-4 w-4" />
                                    )}
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
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : Number(val));
                      }}
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
      </Form>
    </div>
  );
}
