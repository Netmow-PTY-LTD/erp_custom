
"use client";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useAddSupplierMutation } from "@/store/features/suppliers/supplierApiService";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { AddressAutocomplete } from "@/components/form/AddressAutocomplete";

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
  status: z.enum(["Active", "Inactive"], "Status is required"),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

/* ------------------ PAGE ------------------ */
export default function AddSupplierPage() {
  const navigate = useNavigate();
  const [addSupplier, { isLoading }] = useAddSupplierMutation();

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
      longitude: 0,
      latitude: 0,
    },
  });

  const { control, handleSubmit, reset, setValue } = form;

  const onSubmit: SubmitHandler<SupplierFormValues> = async (values) => {
    try {

      // Map form values to API payload
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

      const res = await addSupplier(payload).unwrap();
      if (res?.status) {
        toast.success("Supplier added successfully");
        reset(); // reset form after successful submission
        navigate("/dashboard/suppliers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add supplier");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold">Add Supplier</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Supplier Name" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="code"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Supplier Code (optional)</FieldLabel>
                  <Input placeholder="e.g., SUP001" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" placeholder="supplier@example.com" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input placeholder="+60 123-456-7890" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="contactPerson"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Contact Person</FieldLabel>
                  <Input placeholder="John Doe" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="paymentTerms"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Payment Terms</FieldLabel>
                  <Input placeholder="e.g., Net 30" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
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



            <Controller
              control={control}
              name="state"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>State / Province</FieldLabel>
                  <Input placeholder="State" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="postal_code"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Postal Code</FieldLabel>
                  <Input placeholder="Postal code" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="city"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <Input placeholder="City" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="country"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Input placeholder="Country" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />


            <Controller
              control={control}
              name="latitude"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Latitude (Optional)</FieldLabel>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g. 40.7128"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="longitude"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Longitude (Optional)</FieldLabel>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g. -74.0060"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />



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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Supplier"}
          </Button>
        </div>
      </form>
    </div>
  );
}
