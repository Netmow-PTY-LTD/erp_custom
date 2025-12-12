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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon, ArrowLeft, ChevronDown, Check } from "lucide-react";
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
import { Link, useNavigate, useParams } from "react-router";
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
} from "@/store/features/staffs/staffApiService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ImageUploaderPro from "@/components/form/ImageUploaderPro";
import type { Staff } from "@/types/staff.types";
import { useGetAllDepartmentsQuery } from "@/store/features/admin/departmentApiService";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// =====================================================
//  FORM SCHEMA
// =====================================================
const StaffSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department: z.number().optional(),
  position: z.string().min(1, "Required"),
  hire_date: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Invalid date",
  }),
  salary: z.number().optional(),
  status: z.enum(["active", "terminated", "on_leave"]),
  image: z.string().optional(),
  gallery_items: z.array(z.string()).optional(),
});

type StaffFormValues = z.infer<typeof StaffSchema>;

// =====================================================
//  EDIT PAGE
// =====================================================
export default function EditStaffPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [page] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;
  const { staffId } = useParams<{ staffId: string }>();
  const { data, isLoading: isFetching } = useGetStaffByIdQuery(staffId!);
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

  const navigate = useNavigate();

  const { data: fetchedDepartments } = useGetAllDepartmentsQuery({
    page,
    limit,
    search,
  });

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      department: 0,
      position: "",
      hire_date: "",
      salary: 0,
      status: "active",
      image: "",
      gallery_items: [],
    },
  });

  const staff: Staff | undefined = Array.isArray(data?.data)
    ? data?.data[0]
    : data?.data;

  useEffect(() => {
    if (staff) {
      

      form.reset({
        first_name: staff?.first_name,
        last_name: staff?.last_name,
        email: staff?.email,
        phone: staff?.phone || "",
        department: staff?.department_id,
        position: staff?.position,
        hire_date: staff?.hire_date,
        salary: staff?.salary || 0,
        status: staff?.status,
        image: staff?.thumb_url,
        gallery_items: staff?.gallery_items,
      });
    }
  }, [staff, fetchedDepartments?.data, form]);

  // =====================================================
  //  SUBMIT HANDLER
  // =====================================================
  const onSubmit = async (values: StaffFormValues) => {
     const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      department_id: values.department,
      position: values.position,
      hire_date: values.hire_date,
      salary: values.salary,
      status: values.status,
      thumb_url: values.image,
      gallery_items: values.gallery_items,
    };
    try {
      // const fd = new FormData();

      // Object.entries(values).forEach(([key, val]) => {
      //   if (val !== null && val !== undefined) {
      //     if (key === "image") {
      //       if (val) fd.append("image", val);
      //     } else fd.append(key, String(val));
      //   }
      // });

      // const res = await updateStaff({ id, data: fd }).unwrap();
      const res = await updateStaff({ id: staffId!, body: payload }).unwrap();

      if (res.status) {
        toast.success("Staff updated successfully!");
        navigate("/dashboard/staffs");
      }
    } catch (err) {
      toast.error("Failed to update staff.");
      console.log(err);
    }
  };

  if (isFetching) return <p>Loading...</p>;

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold">Edit Staff Member</h1>

        <Link to="/dashboard/staffs">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Back to Staffs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT FORM */}
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
                {/* PROFILE IMAGE */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>

                      <ImageUploaderPro
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FIRST + LAST NAME */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First name" />
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
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="email@example.com" />
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
                          <Input {...field} placeholder="+60123456789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* DEPARTMENT + POSITION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => {
                      const selected = fetchedDepartments?.data?.find(
                        (dept) => Number(dept.id) === Number(field.value)
                      );
                      
                      return (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between font-medium"
                              >
                                {selected
                                  ? selected?.name
                                  : "Select department..."}
                                <ChevronDown className="opacity-50 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0">
                              <Command>
                                {/* Search input */}
                                <CommandInput
                                  placeholder="Search category..."
                                  className="h-9"
                                  value={search}
                                  onValueChange={setSearch}
                                />

                                <CommandList>
                                  <CommandEmpty>
                                    No department found.
                                  </CommandEmpty>

                                  <CommandGroup>
                                    {fetchedDepartments?.data?.map((dept) => (
                                      <CommandItem
                                        key={dept?.id}
                                        value={`${dept?.name}-${dept?.id}`} // unique, string
                                        onSelect={() => {
                                          field.onChange(dept?.id); // convert back to number
                                          setOpen(false);
                                        }}
                                      >
                                        {dept?.name}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            Number(field.value) ===
                                              Number(dept?.id)
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
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Position" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* HIRE DATE + SALARY */}
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
                              selected={new Date(field.value)}
                              onSelect={(date) =>
                                date && field.onChange(date.toISOString())
                              }
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
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            placeholder="1000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* STATUS */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gallery_items"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Gallery</FormLabel>

                      <ImageUploaderPro
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                        multiple
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SAVE BUTTON */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* RIGHT INFO BOX */}
        <Card className="shadow-sm border rounded-xl h-fit">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>

          <CardContent className="text-sm space-y-4">
            <p>ℹ️ You can update any field of this staff member.</p>
            <p>❗ Email must remain unique.</p>
            <p>🖼️ Uploading a new image will replace the old one.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
