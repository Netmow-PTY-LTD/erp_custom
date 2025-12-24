/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { AddressAutocomplete } from "@/components/form/AddressAutocomplete";
import {
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation
} from "@/store/features/suppliers/supplierApiService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ------------------ ZOD SCHEMA ------------------ */
const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  email: z.email("Invalid email").optional(),
  phone: z.string().optional(),
  contactPerson: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  paymentTerms: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

/* ------------------ PAGE ------------------ */
export default function EditSupplierPage() {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const { data: supplierData, isLoading: isFetching } = useGetSupplierByIdQuery(supplierId as string);
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      contactPerson: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Malaysia",
      paymentTerms: "",
      status: "Active",
      latitude: 0,
      longitude: 0,
    },
  });

  const { control, handleSubmit, reset, setValue } = form;

  // Prefill form
  useEffect(() => {
    if (supplierData?.data && !Array.isArray(supplierData.data)) {
      const s = supplierData.data;
      reset({
        name: s.name,
        code: s.code,
        email: s.email,
        phone: s.phone,
        contactPerson: s.contact_person,
        address: s.address,
        city: s.city,
        state: s.state,
        postal_code: s.postal_code,
        country: s.country,
        paymentTerms: s.payment_terms,
        status: s.is_active ? "Active" : "Inactive",
        latitude: s.latitude || 0,
        longitude: s.longitude || 0,
      });
    }
  }, [supplierData, reset]);

  const onSubmit: SubmitHandler<SupplierFormValues> = async (values) => {
    try {
      const payload = {
        name: values.name,
        code: values.code,
        contact_person: values.contactPerson,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        postal_code: values.postal_code,
        country: values.country,
        payment_terms: values.paymentTerms,
        latitude: values.latitude,
        longitude: values.longitude,
        is_active: values.status === "Active",
      };

      const res = await updateSupplier({ id: supplierId as string, body: payload }).unwrap();
      if (res?.status) {
        toast.success("Supplier updated successfully");
        navigate("/dashboard/suppliers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update supplier");
    }
  };

  if (isFetching) return <p>Loading supplier data...</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold">Update Supplier</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {["name", "code", "email", "phone", "contactPerson", "paymentTerms"].map((fieldName) => (
              <Controller
                key={fieldName}
                control={control}
                name={fieldName as any}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{fieldName === "contactPerson" ? "Contact Person" : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FieldLabel>
                    <Input placeholder={fieldName} {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            ))}
          </CardContent>
        </Card>

        {/* ADDRESS */}
        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="address"
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2">
                  <FieldLabel>Address</FieldLabel>
                  <AddressAutocomplete
                    {...field}
                    placeholder="Search address"
                    onAddressSelect={(details) => {
                      field.onChange(details.address);
                      setValue("city", details.city);
                      setValue("state", details.state);
                      setValue("postal_code", details.postalCode);
                      setValue("country", details.country);
                      setValue("latitude", details.latitude);
                      setValue("longitude", details.longitude);
                    }}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {["state", "postal_code", "city", "country", "latitude", "longitude"].map((fieldName) => (
              <Controller
                key={fieldName}
                control={control}
                name={fieldName as any}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{fieldName.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</FieldLabel>

                    <Input
                      type={["latitude", "longitude"].includes(fieldName) ? "number" : "text"}
                      placeholder={fieldName}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          ["latitude", "longitude"].includes(fieldName) ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value
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

        {/* STATUS */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Supplier"}
          </Button>
        </div>
      </form>
    </div>
  );
}











