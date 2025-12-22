"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// role.schema.ts

import { z } from "zod";
import { PERMISSION_GROUPS } from "@/config/permissions";
import { useParams } from "react-router";
import { useGetRoleByIdQuery, useUpdateRoleMutation } from "@/store/features/role/roleApiService";
import { useEffect } from "react";
import { toast } from "sonner";


const roleSchema = z.object({
 role: z.string().min(1, "Role code is required"),
  display_name: z.string().min(1, "Display name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;


export default function PermissionsPage() {

  const { roleId } = useParams();

  const { data, isLoading } = useGetRoleByIdQuery(roleId as string, { skip: !roleId });
  const [updateRole, { isLoading: updateRoleIsLoading }] = useUpdateRoleMutation()

  const roleView = data?.data


  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: "",
      display_name: "",
      description: "",
      status: "active",
      permissions: [],
    },
  });



  // Update form when API data is loaded
  useEffect(() => {
    if (roleView && Object.keys(roleView).length) {
      form.reset({
        role: roleView.role|| "",
        display_name: roleView.display_name || "",
        description: roleView.description || "",
        status: roleView.status as "active" | "inactive",
        permissions: roleView.permissions || [],
      });

    }
  }, [roleView, form]);




  // Watch permissions for checkboxes
  const permissions = useWatch({
    control: form.control,
    name: "permissions",
  });

  const togglePermission = (value: string) => {
    const current = form.getValues("permissions");
    form.setValue(
      "permissions",
      current.includes(value)
        ? current.filter(p => p !== value)
        : [...current, value]
    );
  };

  const toggleGroup = (groupPermissions: string[]) => {
    const current = form.getValues("permissions");
    const allSelected = groupPermissions.every(p =>
      current.includes(p)
    );

    form.setValue(
      "permissions",
      allSelected
        ? current.filter(p => !groupPermissions.includes(p))
        : Array.from(new Set([...current, ...groupPermissions]))
    );
  };

  const onSubmit = async (values: RoleFormValues) => {
    if (!roleId) return;

    try {
      // Call the API mutation
      const response = await updateRole({ roleId, body: values }).unwrap();
      // Success feedback (you can replace with toast or modal)
      if (response.status) {
        console.log("Role updated successfully:", response);
        toast.success(response.message || "Role updated successfully")

      }


      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Error handling
      console.error("Failed to update role:", error);
      alert(
        error?.data?.message || "Something went wrong while updating the role."
      );
    }
  };



  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading role...</div>
    );
  }

  // Role not found
  if (!roleView) {
    return (
      <div className="p-6 text-center text-red-500">
        Role not found or data is missing.
      </div>
    );
  }




  return (
    <div className=" p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Role & Permissions</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Role Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Code</FormLabel>
                      <FormControl>
                        <Input placeholder="ADMIN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="System Administrator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Short description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block w-full">Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Permissions */}
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Permissions
                    </FormLabel>

                    <div className="space-y-4">
                      {Object.entries(PERMISSION_GROUPS).map(
                        ([groupName, perms]) => {
                          const values = Object.values(perms);
                          const allChecked = values.every(p =>
                            permissions.includes(p)
                          );

                          return (
                            <Card key={groupName}>
                              <CardHeader className="flex flex-row items-center justify-between py-3">
                                <CardTitle className="text-sm">
                                  {groupName}
                                </CardTitle>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleGroup(values)}
                                >
                                  {allChecked ? "Unselect All" : "Select All"}
                                </Button>
                              </CardHeader>

                              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {values.map(permission => (
                                  <label
                                    key={permission}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <Checkbox
                                      checked={permissions.includes(permission)}
                                      onCheckedChange={() =>
                                        togglePermission(permission)
                                      }
                                    />
                                    {permission}
                                  </label>
                                ))}
                              </CardContent>
                            </Card>
                          );
                        }
                      )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={updateRoleIsLoading}>
                  {updateRoleIsLoading ? "Saving..." : "Save Role"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
