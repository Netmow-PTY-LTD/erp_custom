import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DepartmentForm from "./DepartmentForm";
import { useGetDepartmentByIdQuery } from "@/store/features/admin/departmentApiService";
import { type DepartmentFormValues } from "@/pages/departments";

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

  const { data: department } = useGetDepartmentByIdQuery(departmentId!, {
    skip: departmentId === null,
  });

  console.log("Editing Department: ", department);

  const onSubmit = (values: DepartmentFormValues) => {
    console.log("Edit Department: ", values);
    onOpenChange(false);
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
        </SheetHeader>

       <div className="px-4">
         {department && (
          <DepartmentForm
            initialValues={department.data[0]}
            onSubmit={onSubmit}
          />
        )}
       </div>
      </SheetContent>
    </Sheet>
  );
}
