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

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  status: z.string().min(1, "Status is required"),
});


export default function EditProductCategoryForm({open, setOpen}: {open: boolean; setOpen: (open: boolean) => void;}) {
     const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
          name: "",
          status: "Active",
        },
      });
    
      const handleUpdateCategory = (values: z.infer<typeof categorySchema>) => {
        console.log(values);
      };
    
  return (
     <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="max-w-[400px] w-full">
          <SheetHeader>
            <SheetTitle>Update Category</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateCategory)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                <Button type="submit">Update Category</Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
  )
}
