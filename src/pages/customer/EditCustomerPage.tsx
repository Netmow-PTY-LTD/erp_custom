import { useEffect } from "react";
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
import { Link, useParams } from "react-router";

/* ------------------ ZOD SCHEMA ------------------ */
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),

  latitude: z.string().optional(),
  longitude: z.string().optional(),

  creditLimit: z.number().min(0, "Credit limit must be 0 or more"),
  status: z.string().min(1, "Status is required"),
  route: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

/* ------------------ PAGE ------------------ */
export default function EditCustomerPage() {
  const { id } = useParams(); // customer/:id

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Malaysia",
      latitude: "",
      longitude: "",
      creditLimit: 0,
      status: "Active",
      route: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  /* ------------------ FETCH CUSTOMER BY ID ------------------ */
  useEffect(() => {
    async function fetchCustomer() {
      // Replace this with your real fetch API call
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();

      // Reset form with API data
      reset({
        name: data.name ?? "",
        company: data.company ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        postalCode: data.postalCode ?? "",
        country: data.country ?? "Malaysia",
        latitude: data.latitude ?? "",
        longitude: data.longitude ?? "",
        creditLimit: data.creditLimit ?? 0,
        status: data.status ?? "Active",
        route: data.route ?? "",
      });
    }

    fetchCustomer();
  }, [id, reset]);

  /* ------------------ SUBMIT ------------------ */
  const onSubmit: SubmitHandler<CustomerFormValues> = async (values) => {
    console.log("Updated:", values);

    await fetch(`/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/dashboard/customers">
          <Button variant="outline">← Back to Customers</Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Customer</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* NAME */}
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Enter name" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* COMPANY */}
            <Controller
              control={control}
              name="company"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Company</FieldLabel>
                  <Input placeholder="Enter company" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* EMAIL */}
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input placeholder="Enter email" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* PHONE */}
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input placeholder="Enter phone" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* ADDRESS */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Address */}
            <Controller
              control={control}
              name="address"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Textarea placeholder="Enter address" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* City / State / Postal / Country */}
            <div className="grid gap-4 md:grid-cols-4">
              {/* CITY */}
              <Controller
                control={control}
                name="city"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <Input placeholder="Start typing city..." {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              {/* STATE */}
              <Controller
                control={control}
                name="state"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>State</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Selangor">Selangor</SelectItem>
                        <SelectItem value="Kuala Lumpur">Kuala Lumpur</SelectItem>
                        <SelectItem value="Johor">Johor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              {/* POSTAL CODE */}
              <Controller
                control={control}
                name="postalCode"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Postal Code</FieldLabel>
                    <Input placeholder="Enter postal code" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              {/* COUNTRY */}
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Country</FieldLabel>
                    <Input disabled {...field} />
                  </Field>
                )}
              />
            </div>

            {/* LAT / LNG */}
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="latitude"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Latitude</FieldLabel>
                    <Input placeholder="Latitude" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="longitude"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Longitude</FieldLabel>
                    <Input placeholder="Longitude" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ACCOUNT */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            {/* CREDIT LIMIT */}
            <Controller
              control={control}
              name="creditLimit"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Credit Limit (RM)</FieldLabel>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* ROUTE */}
            <Controller
              control={control}
              name="route"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Assign to Route</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select Route --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Route A">Route A</SelectItem>
                      <SelectItem value="Route B">Route B</SelectItem>
                      <SelectItem value="Route C">Route C</SelectItem>
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
          <Button type="submit">Update Customer</Button>
        </div>
      </form>
    </div>
  );
}
