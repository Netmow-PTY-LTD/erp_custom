import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DepartmentForm from "./DepartmentForm";
import type { DepartmentFormValues } from "@/pages/departments";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (values: DepartmentFormValues) => void;
}

export default function AddDepartmentForm({ open, onOpenChange, onAdd }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Department</SheetTitle>
        </SheetHeader>

       <div className="px-4">
         <DepartmentForm
          onSubmit={(values) => {
            onAdd(values);
            onOpenChange(false);
          }}
        />
       </div>
      </SheetContent>
    </Sheet>
  );
}
