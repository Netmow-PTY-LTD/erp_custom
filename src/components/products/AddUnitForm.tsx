import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Form } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAddUnitMutation } from "@/store/features/admin/productsApiService";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const unitSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  symbol: z.string(),
  is_active: z.boolean().optional(),
});
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetchUnits: () => void;
}


export default function AddUnitForm({ open, onOpenChange, refetchUnits }: Props) {
  const form = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: "",
      symbol: "",
      is_active: true,
    },
  });

  const [addUnit, { isLoading }] = useAddUnitMutation();

  const onSubmit = async (data: z.infer<typeof unitSchema>) => {
    console.log("Form data:", data);

    const payload = {
      name: data.name,
      symbol: data.symbol,
      is_active: data.is_active,
    };

    try {
      const res = await addUnit(payload).unwrap();
      console.log("Unit added successfully:", res);
      if (res.status) {
        toast.success("Unit added successfully");
        onOpenChange(false);
        form.reset();
        refetchUnits();
      }
    } catch (error) {
      console.error("Error adding unit:", error);
      toast.error("Failed to add unit" + (error instanceof Error ? ": " + error.message : ""));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Unit</SheetTitle>
        </SheetHeader>

        <div className="px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Unit Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="name">Unit Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="Unit name (e.g., Pieces)"
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Symbol */}
                <Controller
                  name="symbol"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="symbol">Unit Code</FieldLabel>
                      <Input
                        id="symbol"
                        placeholder="Abbreviation (e.g., pcs)"
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Is Active */}
                <Controller
                  name="is_active"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="is_active">Active</FieldLabel>

                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(val) => field.onChange(val === "true")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>

                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Submit Button */}
                <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Adding...
                  </div>
                ) : (
                  "Add Unit"
                )}
              </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
