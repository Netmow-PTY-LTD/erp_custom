"use client";

import { useForm } from "react-hook-form";
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

 const roleSchema = z.object({
  name: z.string().min(1, "Role code is required"),
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Active", "Inactive"]),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;





export default function PermissionsPage() {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      status: "Active",
      permissions: [],
    },
  });

  const permissions = form.watch("permissions");

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

  const onSubmit = (values: RoleFormValues) => {
    console.log("ROLE PAYLOAD:", values);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
                  name="name"
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
                  name="displayName"
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
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
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
                <Button type="submit">Save Role</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
