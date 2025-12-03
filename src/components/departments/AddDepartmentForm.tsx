import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DepartmentForm from "./DepartmentForm";
import { type DepartmentFormValues } from "@/pages/departments";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddDepartmentForm({ open, onOpenChange }: Props) {

  const onSubmit = (values: DepartmentFormValues) => {
    console.log("Add Department: ", values);
    onOpenChange(false);
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Department</SheetTitle>
        </SheetHeader>

       <div className="px-4">
         <DepartmentForm
          onSubmit={onSubmit}
        />
       </div>
      </SheetContent>
    </Sheet>
  );
}
