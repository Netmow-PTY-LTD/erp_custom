import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetSingleDebitHeadQuery,
  useUpdateDebitHeadMutation,
} from "@/store/features/accounting/accoutntingApiService";
import { useEffect } from "react";
import type { DebitHead } from "@/types/accounting.types";

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const debitHeadSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  code: z.string().min(1, "Category code is required"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});
export default function EditDebitHeadForm({
  open,
  setOpen,
  debitHeadId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  debitHeadId: number;
}) {
  const form = useForm({
    resolver: zodResolver(debitHeadSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      is_active: true,
    },
  });

  const { data: fetchedDebitHead } = useGetSingleDebitHeadQuery(
    debitHeadId,
    { skip: !debitHeadId }
  );

  console.log("fetchedDebitHead", fetchedDebitHead);

  const debitHead: DebitHead | undefined = fetchedDebitHead?.data;

  useEffect(() => {
    if (debitHead) {
      form.reset({
        name: debitHead.name,
        code: debitHead.code,
        description: debitHead.description,
        is_active: debitHead.is_active,
      });
    }
  }, [debitHead, form]);

  const [updateDebitHead, { isLoading }] = useUpdateDebitHeadMutation();

  const handleUpdateDebitHead = async (
    values: z.infer<typeof debitHeadSchema>
  ) => {
    console.log(values);
    const payload = {
      id: debitHeadId,
      body: {
        name: values.name,
        code: values.code,
        description: values.description,
        is_active: values.is_active,
      },
    };

    try {
      const res = await updateDebitHead(payload).unwrap();
      console.log("Debit Head updated successfully:", res);

      if (res.status) {
        toast.success(res.message || "Debit Head updated successfully");
        setOpen(false);
        form.reset();
      } else {
        toast.error("Failed to update Debit Head: " + res.message);
      }
    } catch (error) {
      toast.error("Error updating Debit Head");
      if (error instanceof Error) {
        toast.error("Error updating Debit Head: " + error.message);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="max-w-[400px] w-full">
        <SheetHeader>
          <SheetTitle>Edit Debit Head</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateDebitHead)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debit Head Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter debit head name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="i.e. CR001" {...field} />
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
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
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
