import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  DepartmentSchema,
  type DepartmentFormValues,
} from "@/pages/departments";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import {
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
} from "@/store/features/admin/departmentApiService";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: number | null;
}

export default function EditDepartmentForm({
  open,
  onOpenChange,
  departmentId,
}: Props) {
  const navigate = useNavigate();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: department } = useGetDepartmentByIdQuery(departmentId!, {
    skip: departmentId === null,
  });

  console.log("Editing Department: ", department);

  const departmentData = department?.data;

  useEffect(() => {
    if (departmentData) {
      form.reset({
        name: departmentData.name,
        description: departmentData.description,
      });
    }
  }, [departmentData, form]);
  
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

  const onSubmit = async (values: DepartmentFormValues) => {
    console.log("Edit Department: ", values);
    const payload = {
      id: departmentId!,
      body: {
        name: values.name,
        description: values.description,
      },
    };
    try {
      const res = await updateDepartment(payload).unwrap();
      console.log("Department updated successfully: ", res);
      if (res.status) {
        toast.success("Department updated successfully");
        navigate("/dashboard/departments");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating department: ", error);
      toast.error("Failed to update department");
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
        </SheetHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              className="space-y-4 mt-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Department name" {...field} />
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
                    <FormControl>
                      <Textarea
                        placeholder="Department description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
