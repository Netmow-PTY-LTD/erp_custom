import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddUnitForm from "@/components/products/AddUnitForm";
import EditUnitForm from "@/components/products/EditUnitForm";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([
    { id: 1, name: "Pieces", abbreviation: "pcs" },
    { id: 2, name: "Box", abbreviation: "box" },
    { id: 3, name: "Carton", abbreviation: "ctn" },
    { id: 4, name: "Kilogram", abbreviation: "kg" },
  ]);

  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const deleteUnit = (id: number) => {
    setUnits(units.filter((u) => u.id !== id));
  };

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: "name",
      header: "Unit Name",
    },
    {
      accessorKey: "abbreviation",
      header: "Short Code",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const unit = row.original as Unit;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingUnit(unit);
                setEditSheetOpen(true);
              }}
            >
              Edit
            </Button>
            <Button variant="destructive" onClick={() => deleteUnit(unit.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Units Management</h1>

        <Button className="mb-4" onClick={() => setAddSheetOpen(true)}>
          + Add Unit
        </Button>
      </div>

      <DataTable columns={columns} data={units} />

      <AddUnitForm
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
        onAdd={(unit) =>
          setUnits([...units, { id: units.length + 1, ...unit }])
        }
      />

      <EditUnitForm
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        unit={editingUnit}
        onSave={(updated) =>
          setUnits(units.map((u) => (u.id === updated.id ? updated : u)))
        }
      />
    </div>
  );
}
