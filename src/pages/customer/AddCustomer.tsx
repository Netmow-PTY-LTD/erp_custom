
import {
  Controller,
  useForm,
  type SubmitHandler,
  type Resolver,
} from "react-hook-form";
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
import { Link, useNavigate } from "react-router";
import { useCreateCustomerMutation } from "@/store/features/customers/customersApi";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";
import { AddressAutocomplete } from "@/components/form/AddressAutocomplete";
import { SalesRouteSelectField } from "@/components/salesRoute/RouteSelectField";


/* ------------------ ZOD SCHEMA ------------------ */
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  customer_type: z.enum(["individual", "business"]).default("individual"),
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
  credit_limit: z.number().min(0, "Credit limit must be 0 or more").default(0),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  salesRouteId: z.string().optional() // <-- string now
});

type CustomerFormValues = z.infer<typeof customerSchema>;

/* ------------------ PAGE ------------------ */
export default function AddCustomerPage() {
  const navigate = useNavigate();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const currency = useAppSelector((state) => state.currency.value);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as Resolver<CustomerFormValues>,
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

  const { control, handleSubmit, setValue } = form;

  // const address = useWatch({ control, name: "address" });
  // const city = useWatch({ control, name: "city" });
  // const state = useWatch({ control, name: "state" });
  // const country = useWatch({ control, name: "country" });
  // const postalCode = useWatch({ control, name: "postal_code" });



  // EFFECT: Auto-fetch lat/lng based on manual address inputs (OPTIONAL / LEGACY)
  // Since we are using AddressAutocomplete, this might be redundant or conflicting.
  // We can keep a simplified version or just rely on Autocomplete.
  // For now, disabling to prioritize Autocomplete values.
  /*
  useEffect(() => {
    const fetchLatLng = async () => {
      const fullAddress = [
        address,
        city,
        state,
        postalCode,
        country,
      ]
        .filter(Boolean)
        .join(", ");

      if (fullAddress.length < 5) return;

      try {
        const location = await geocodeAddress(fullAddress);
    
        setValue("latitude", location.lat);
        setValue("longitude", location.lng);
      } catch (error) {
        console.error("Failed to auto fetch lat/lng", error);
      }
    };

    fetchLatLng();
  }, [address, city, state, postalCode, country, setValue]);
  */










  const onSubmit: SubmitHandler<CustomerFormValues> = async (values) => {

    try {
      const payload = {
        ...values,
        salesRouteId: Number(values.salesRouteId)

      }
      const res = await createCustomer(payload).unwrap();
      if (res.status) {
        toast.success(res.message || "Customer created successfully");
      }
      navigate("/dashboard/customers");
    } catch (error) {
      toast.error("Failed to create customer");
      console.error("Failed to create customer:", error);
    }
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
                    <FieldLabel>
                      Credit Limit {currency ? `(${currency})` : ""}
                    </FieldLabel>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Save Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
}









// ------------------------- this is older code base ---------------------------

// import {
//   Controller,
//   useForm,
//   type SubmitHandler,
//   type Resolver,
// } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Field, FieldLabel, FieldError } from "@/components/ui/field";

// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// import { Button } from "@/components/ui/button";
// import { Link, useNavigate } from "react-router";
// import { useCreateCustomerMutation } from "@/store/features/customers/customersApi";
// import { toast } from "sonner";
// import { useAppSelector } from "@/store/store";

// /* ------------------ ZOD SCHEMA ------------------ */
// const customerSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   company: z.string().optional(),
//   customer_type: z.enum(["individual", "business"]).default("individual"),
//   tax_id: z.string().optional(),
//   email: z.string().email("Invalid email").optional().or(z.literal("")),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   city: z.string().optional(),
//   state: z.string().optional(),
//   country: z.string().optional(),
//   postal_code: z.string().optional(),
//   latitude: z.number().optional(),
//   longitude: z.number().optional(),
//   credit_limit: z.number().min(0, "Credit limit must be 0 or more").default(0),
//   notes: z.string().optional(),
//   is_active: z.boolean().default(true),
// });

// type CustomerFormValues = z.infer<typeof customerSchema>;

// /* ------------------ PAGE ------------------ */
// export default function AddCustomerPage() {
//   const navigate = useNavigate();
//   const [createCustomer, { isLoading }] = useCreateCustomerMutation();

//   const currency = useAppSelector((state) => state.currency.value);

//   const form = useForm<CustomerFormValues>({
//     resolver: zodResolver(customerSchema) as Resolver<CustomerFormValues>,
//     defaultValues: {
//       name: "",
//       company: "",
//       customer_type: "individual",
//       tax_id: "",
//       email: "",
//       phone: "",
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       postal_code: "",
//       credit_limit: 0,
//       notes: "",
//       is_active: true,
//     },
//   });

//   const { control, handleSubmit } = form;

//   const onSubmit: SubmitHandler<CustomerFormValues> = async (values) => {
//     try {
//       await createCustomer(values).unwrap();
//       toast.success("Customer created successfully");
//       navigate("/dashboard/customers");
//     } catch (error) {
//       toast.error("Failed to create customer");
//       console.error("Failed to create customer:", error);
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto py-6">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
//         <h1 className="text-3xl font-bold">Add Customer</h1>
//         <Link to="/dashboard/customers">
//           <Button variant="outline">← Back to Customers</Button>
//         </Link>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* BASIC INFORMATION */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Information</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//               <Controller
//                 control={control}
//                 name="name"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Customer Name *</FieldLabel>
//                     <Input placeholder="e.g. John Doe" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="company"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Company Name</FieldLabel>
//                     <Input placeholder="e.g. Acme Corp" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="customer_type"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Customer Type</FieldLabel>
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="individual">Individual</SelectItem>
//                         <SelectItem value="business">Business</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="tax_id"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Tax ID / Registration Number</FieldLabel>
//                     <Input placeholder="GST / VAT / Company Reg." {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="email"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Email</FieldLabel>
//                     <Input type="email" placeholder="Enter email" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="phone"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Phone</FieldLabel>
//                     <Input placeholder="Enter phone" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />
//             </div>

//             <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//               <Controller
//                 control={control}
//                 name="address"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Address</FieldLabel>
//                     <Textarea placeholder="Street address" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <div className="grid gap-4">
//                 <Controller
//                   control={control}
//                   name="city"
//                   render={({ field, fieldState }) => (
//                     <Field>
//                       <FieldLabel>City</FieldLabel>
//                       <Input placeholder="City" {...field} />
//                       <FieldError>{fieldState.error?.message}</FieldError>
//                     </Field>
//                   )}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Controller
//                 control={control}
//                 name="state"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>State / Province</FieldLabel>
//                     <Input placeholder="State" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="postal_code"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Postal Code</FieldLabel>
//                     <Input placeholder="Postal code" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="country"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Country</FieldLabel>
//                     <Input placeholder="Country" {...field} />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Controller
//                 control={control}
//                 name="latitude"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Latitude (Optional)</FieldLabel>
//                     <Input
//                       type="number"
//                       step="any"
//                       placeholder="e.g. 40.7128"
//                       value={field.value || ""}
//                       onChange={(e) =>
//                         field.onChange(
//                           e.target.value ? Number(e.target.value) : undefined
//                         )
//                       }
//                     />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="longitude"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Longitude (Optional)</FieldLabel>
//                     <Input
//                       type="number"
//                       step="any"
//                       placeholder="e.g. -74.0060"
//                       value={field.value || ""}
//                       onChange={(e) =>
//                         field.onChange(
//                           e.target.value ? Number(e.target.value) : undefined
//                         )
//                       }
//                     />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Controller
//                 control={control}
//                 name="credit_limit"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>
//                       Credit Limit {currency ? `(${currency})` : ""}
//                     </FieldLabel>
//                     <Input
//                       type="number"
//                       value={field.value}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="is_active"
//                 render={({ field, fieldState }) => (
//                   <Field>
//                     <FieldLabel>Status</FieldLabel>
//                     <Select
//                       value={field.value ? "active" : "inactive"}
//                       onValueChange={(val) => field.onChange(val === "active")}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="active">Active</SelectItem>
//                         <SelectItem value="inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FieldError>{fieldState.error?.message}</FieldError>
//                   </Field>
//                 )}
//               />
//             </div>

//             <Controller
//               control={control}
//               name="notes"
//               render={({ field, fieldState }) => (
//                 <Field>
//                   <FieldLabel>Notes</FieldLabel>
//                   <Textarea placeholder="Additional notes..." {...field} />
//                   <FieldError>{fieldState.error?.message}</FieldError>
//                 </Field>
//               )}
//             />
//           </CardContent>
//         </Card>

//         {/* SUBMIT */}
//         <div className="flex justify-end">
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? "Creating..." : "Save Customer"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
