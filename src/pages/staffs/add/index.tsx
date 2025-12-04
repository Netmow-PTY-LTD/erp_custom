"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUploader } from "@/components/form/ImageUploader";
import { Link, useNavigate } from "react-router";
import { useAddStaffMutation } from "@/store/features/staffs/staffApiService";
import { toast } from "sonner";

// =====================================================
//  FORM SCHEMA (PAYLOAD READY)
// =====================================================
const StaffSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().min(1, "Required"),
  hire_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  salary: z.number().optional(),
  // address: z.string().optional(),
  status: z.string(),
  image: z.instanceof(File).optional().nullable(),
});

type StaffFormValues = z.infer<typeof StaffSchema>;

// =====================================================
//  PAGE COMPONENT
// =====================================================
export default function AddStaffPage() {
  const navigate = useNavigate();
  const [addStaff, { isLoading }] = useAddStaffMutation();


  const form = useForm<StaffFormValues>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      hire_date: "",
      salary: 0,
      // address: "",
      status: "Active",
      image: null,
    },
  });

  // =====================================================
  // API PAYLOAD + SUBMIT HANDLER
  // =====================================================
  const onSubmit = async (values: StaffFormValues) => {
    try {
      // const fd = new FormData();

      // fd.append("first_name", values.first_name);
      // fd.append("last_name", values.last_name);
      // fd.append("email", values.email);
      // fd.append("phone", values.phone ?? "");
      // fd.append("department", values.department ?? "");
      // fd.append("position", values.position);
      // fd.append("hire_date", values.hire_date);
      // fd.append("salary", values.salary ?? "");
      // fd.append("status", values.status);

      // if (values.image) {
      //   fd.append("image", values.image);
      // }

      // const res = await addStaff(fd).unwrap();
      const res = await addStaff(values).unwrap();

      if (res.status) {
        navigate("/dashboard/staffs");
        toast.success("Staff member added successfully!");
      }
      console.log("API Response:", res);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("API Error:", err);
      toast.error(
        err?.data?.message || "Failed to add staff member. Please try again."
      );
    }
  };


  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold">Add New Staff Member</h1>

        <Link to="/dashboard/staffs">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Back to Staffs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE FORM */}
        <Card className="col-span-2 shadow-sm border rounded-xl">
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>

                      <ImageUploader
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ROW 1 — FIRST + LAST NAME */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First Name <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last Name <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ROW 2 — EMAIL + PHONE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+60123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ROW 3 — DEPT + POSITION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Position <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="position" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ROW 4 — HIRE DATE + SALARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hire_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hire Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "Pick date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  field.onChange(date.toISOString());
                                }
                              }}
                              initialFocus
                              required={false}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary (RM)</FormLabel>
                        <FormControl>
                          <Input placeholder="salary i.e. 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ADDRESS */}
                {/* <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Street, City, State, Postal Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* STATUS */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status <span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Staff Member"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* RIGHT SIDE INFO BOX */}
        <Card className="shadow-sm border rounded-xl h-fit">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <p>ℹ️ Employee ID will be generated automatically.</p>
            <p>❗ Fields marked with * are required.</p>
            <p>🛡️ Email addresses must be unique.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



