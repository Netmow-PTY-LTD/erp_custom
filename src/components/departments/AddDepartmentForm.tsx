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
import { useAddDepartmentMutation } from "@/store/features/admin/departmentApiService";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddDepartmentForm({ open, onOpenChange }: Props) {
  const navigate = useNavigate();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [addDepartment, { isLoading }] = useAddDepartmentMutation();
  const onSubmit = async (values: DepartmentFormValues) => {
   // console.log("Add Department: ", values);

    const payload = {
      name: values.name,
      description: values.description,
    };

    try {
      const res = await addDepartment(payload).unwrap();
      console.log("Department added successfully: ", res);
      if (res.status) {
        toast.success("Department added successfully");
        navigate("/dashboard/departments");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error adding department: ", error);
      toast.error("Failed to add department");
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Department</SheetTitle>
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

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
