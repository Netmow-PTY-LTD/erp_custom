import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (unit: { name: string; abbreviation: string }) => void;
}

export default function AddUnitForm({ open, onOpenChange, onAdd }: Props) {
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");

  const submit = () => {
    if (!name.trim() || !abbr.trim()) return;
    onAdd({ name, abbreviation: abbr });
    setName("");
    setAbbr("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Unit</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6 px-4">
          <Input
            placeholder="Unit name (e.g., Pieces)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Abbreviation (e.g., pcs)"
            value={abbr}
            onChange={(e) => setAbbr(e.target.value)}
          />

          <Button className="w-full" onClick={submit}>
            Add Unit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
