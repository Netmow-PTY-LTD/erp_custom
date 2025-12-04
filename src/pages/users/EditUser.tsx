

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
import { Link, useNavigate, useParams } from "react-router";
import { useGetAllRolesQuery } from "@/store/features/role/roleApiService";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/store/features/users/usersApiService";

import { toast } from "sonner";
import React from "react";

// -------------------- ZOD SCHEMA --------------------
const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  role_id: z.number().min(1, "Role is required"),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  console.log("Editing User ID:", userId);

  const { data: rolesData } = useGetAllRolesQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(userId as string);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role_id: undefined,
    },
  });

  const { control, handleSubmit, reset } = form;

  // ⬇ Load user data into form when API loads
  React.useEffect(() => {
    const user =
      Array.isArray(userData?.data) ? userData.data[0] : userData?.data;
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      });
    }
  }, [userData, reset]);

  const onSubmit: SubmitHandler<EditUserFormValues> = async (values) => {
    try {
      if (!userId) {
        toast.error("User ID not found");
        return;
      }
      const res = await updateUser({ id: userId as string, body: values }).unwrap();

      if (res.status) {
        toast.success("User updated successfully");
        navigate("/dashboard/users/list");
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while updating user");
    }
  };

  if (isUserLoading) return <p>Loading user...</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Edit User</h1>

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

            {/* ROLE */}
            <Controller
              control={control}
              name="role_id"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>

                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={!rolesData}
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

          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update User"}
          </Button>
        </div>
      </form>
    </div>
  );
}
