import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DepartmentForm from "./DepartmentForm";
import type { Department } from "@/pages/departments";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSave: (updated: Department) => void;
}

export default function EditDepartmentForm({
  open,
  onOpenChange,
  department,
  onSave,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
        </SheetHeader>

       <div className="px-4">
         {department && (
          <DepartmentForm
            initialValues={{
              name: department.name,
              description: department.description,
            }}
            onSubmit={(values) => {
              onSave({ ...department, ...values });
              onOpenChange(false);
            }}
          />
        )}
       </div>
      </SheetContent>
    </Sheet>
  );
}
