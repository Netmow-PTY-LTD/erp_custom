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
import { Link, useParams, useNavigate } from "react-router";
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/store/features/customers/customersApi";
import { toast } from "sonner";
import { SalesRouteSelectField } from "@/components/salesRoute/RouteSelectField";

/* ------------------ ZOD SCHEMA ------------------ */
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  customer_type: z.enum(["individual", "business"]),
  tax_id: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  credit_limit: z.number().min(0, "Credit limit must be 0 or more"),
  notes: z.string().optional(),
  is_active: z.boolean(),
  salesRouteId: z.string().optional() // <-- string now
});

type CustomerFormValues = z.infer<typeof customerSchema>;

/* ------------------ PAGE ------------------ */
export default function EditCustomerPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: isFetching } = useGetCustomerByIdQuery(
    Number(customerId)
  );
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const customer = data?.data;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      company: "",
      customer_type: "individual",
      tax_id: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      credit_limit: 0,
      notes: "",
      is_active: true,
      salesRouteId: '',
    },
  });

  const { control, handleSubmit, reset } = form;

  /* ------------------ LOAD CUSTOMER DATA ------------------ */
  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        company: customer.company || "",
        customer_type: customer.customer_type,
        tax_id: customer.tax_id || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        country: customer.country || "",
        postal_code: customer.postal_code || "",
        latitude: customer.latitude,
        longitude: customer.longitude,
        credit_limit: customer.credit_limit || 0,
        notes: customer.notes || "",
        is_active: customer.is_active,
        salesRouteId: String(customer.sales_route_id)
      });
    }
  }, [customer, reset]);

  /* ------------------ SUBMIT ------------------ */
  const onSubmit: SubmitHandler<CustomerFormValues> = async (values) => {
    try {
      const payload = {
        ...values,
        salesRouteId: Number(values.salesRouteId)

      }


      const res = await updateCustomer({
        id: Number(customerId),
        data: payload,
      }).unwrap();
      if (res.status) {

        toast.success(res.message || "Customer updated successfully");
        navigate("/dashboard/customers");

      }
    } catch (error) {
      toast.error("Failed to update customer");
      console.error("Failed to update customer:", error);
    }
  };

  if (isFetching) {
    return <div className="p-6">Loading customer...</div>;
  }

  if (!customer) {
    return <div className="p-6 text-red-600">Customer not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <h1 className="text-3xl font-bold">Edit Customer</h1>
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
                    <FieldLabel>Customer Name *</FieldLabel>
                    <Input placeholder="e.g. John Doe" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="company"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Company Name</FieldLabel>
                    <Input placeholder="e.g. Acme Corp" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="customer_type"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Customer Type</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="tax_id"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Tax ID / Registration Number</FieldLabel>
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
                    <Input type="email" placeholder="Enter email" {...field} />
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
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Textarea placeholder="Street address" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <div className="grid gap-4">
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                name="country"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Country</FieldLabel>
                    <Input placeholder="Country" {...field} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="credit_limit"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Credit Limit</FieldLabel>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="is_active"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      value={field.value ? "active" : "inactive"}
                      onValueChange={(val) => field.onChange(val === "active")}
                    >
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
            </div>

            <Controller
              control={control}
              name="notes"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Notes</FieldLabel>
                  <Textarea placeholder="Additional notes..." {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="salesRouteId" // single route
              rules={{ required: "Select a sales route" }}
              render={({ field, fieldState }) => (
                <SalesRouteSelectField
                  field={field}
                  error={fieldState.error?.message}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
