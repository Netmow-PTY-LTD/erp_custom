import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Unit } from "@/pages/unit";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: Unit | null;
  onSave: (updated: Unit) => void;
}

export default function EditUnitForm({ open, onOpenChange, unit, onSave }: Props) {
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");

//  useEffect(() => {
//   if (open && unit) {
//     setName(unit.name);
//     setAbbr(unit.abbreviation);
//   }
// }, [open, unit]);


  const submit = () => {
    if (!unit) return;
    onSave({ ...unit, name, abbreviation: abbr });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Unit</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6 px-4">
          <Input
            placeholder="Unit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Abbreviation"
            value={abbr}
            onChange={(e) => setAbbr(e.target.value)}
          />

          <Button className="w-full" onClick={submit}>
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
