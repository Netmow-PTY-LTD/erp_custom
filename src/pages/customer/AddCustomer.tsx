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
import { Link } from "react-router";

/* ------------------ ZOD SCHEMA ------------------ */
const customerSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  group: z.string().optional(),
  taxId: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  billingAddress: z.string().min(1, "Billing address is required"),
  shippingAddress: z.string().optional(),
  creditLimit: z.number().min(0, "Credit limit must be 0 or more"),
  creditDays: z.number().min(0, "Credit days must be 0 or more"),
  risk: z.string().min(1, "Risk is required"),
  status: z.string().min(1, "Status is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

/* ------------------ PAGE ------------------ */
export default function AddCustomerPage() {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      code: "",
      name: "",
      group: "retail",
      taxId: "",
      email: "",
      phone: "",
      billingAddress: "",
      shippingAddress: "",
      creditLimit: 0,
      creditDays: 0,
      risk: "low",
      status: "Active",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit: SubmitHandler<CustomerFormValues> = (values) => {
    console.log(values);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">Add Customer</h1>
        <Link to="/dashboard/customers">
          <Button variant="outline">← Back to Customers</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Customer Code</FieldLabel>
                    <Input placeholder="e.g. CUST-001" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input placeholder="Legal / trading name" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="group"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Customer Group/Type</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="key_account">Key Account</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="taxId"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Tax Number / Registration Number</FieldLabel>
                    <Input placeholder="GST / VAT / Company Reg." {...field} />
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
                    <Input placeholder="Enter email" {...field} />
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
                    <Input placeholder="Enter phone" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="billingAddress"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Billing Address</FieldLabel>
                    <Textarea placeholder="Enter address" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="shippingAddress"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Shipping Address</FieldLabel>
                    <Textarea placeholder="Enter address" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                name="creditDays"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Credit Days (Payment Terms)</FieldLabel>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              {/* ROUTE */}
              <Controller
                control={control}
                name="risk"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Risk</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
            {/* STATUS */}
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
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
          </CardContent>
        </Card>
        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button type="submit">Save Customer</Button>
        </div>
      </form>
    </div>
  );
}
