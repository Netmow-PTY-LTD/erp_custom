import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const unitSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  abbreviation: z.string(),
  base_unit: z.string(),
  conversion_factor: z.string().optional(),
  base: z.enum(["Yes", "No"]),
});
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditUnitForm({ open, onOpenChange }: Props) {
  const form = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      base_unit: "pcs",
      conversion_factor: "1.0",
      base: "Yes",
    },
  });

  const onSubmit = (data: z.infer<typeof unitSchema>) => {
    console.log("Form data", data);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Unit</SheetTitle>
        </SheetHeader>

        <div className="px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="name">Unit Name</FieldLabel>
                      <Input
                        placeholder="Unit name (e.g., Pieces)"
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="abbreviation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="abbreviation">Unit Code</FieldLabel>
                      <Input
                        placeholder="Abbreviation (e.g., pcs)"
                        {...field}
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="base_unit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="abbreviation">Base Unit</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a base unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pcs">Pieces</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="l">Liters</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="conversion_factor"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="conversion_factor">
                        Conversion Factor
                      </FieldLabel>
                      <Input placeholder="e.g., 1 Box = 12 Pieces" {...field} />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="base"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="base">Base</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select any.." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Button className="w-full">Update Unit</Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
