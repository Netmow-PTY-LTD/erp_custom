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
import { Link, useNavigate } from "react-router";
import { useGetAllRolesQuery } from "@/store/features/role/role";
import { useAddUserMutation } from "@/store/features/users/usersApiService";
import { toast } from "sonner";

// -------------------- ZOD SCHEMA --------------------
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role_id: z.number().min(1, "Role is required"),
  // status: z.string().min(1, "Status is required"),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AddUserPage() {
  const navigate = useNavigate();
  const { data: rolesData, isLoading } = useGetAllRolesQuery();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();



  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role_id: 0,
      // status: "Active",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit: SubmitHandler<UserFormValues> = async (values) => {

    try {
      const result = await addUser(values).unwrap();
      if (result.status) {

        toast.success(result.message || "User added successfully");
        form.reset();
        navigate("/dashboard/users/list");
      } else {
        toast.error("Failed to add user");
      }

    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("An error occurred while adding the user");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">Add User</h1>
        <Link to="/dashboard/users/list">
          <Button variant="outline">← Back to Users</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* NAME */}
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input placeholder="Full Name" {...field} />
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
                  <Input placeholder="Email" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />


            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input placeholder="******" {...field} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* ROLE */}
            <Controller
              control={control}
              name="role_id"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>

                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>

                    <SelectContent>
                      {Array.isArray(rolesData?.data) &&
                        rolesData.data.map((role) => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />


            {/* STATUS */}
            {/* <Controller
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
            /> */}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isAdding}> {isAdding ? "Creating..." : "Create User"}</Button>
        </div>
      </form>
    </div>
  );
}
