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
  base_unit: string; // e.g., PCS, BOX
  conversion_factor: number;
  base: "Yes" | "No"; // whether this is a base unit
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([
    {
      id: 1,
      name: "Pieces",
      abbreviation: "pcs",
      base_unit: "PCS",
      conversion_factor: 1.0,
      base: "Yes",
    },
    {
      id: 2,
      name: "Box",
      abbreviation: "box",
      base_unit: "BOX",
      conversion_factor: 1.0,
      base: "No",
    },
    {
      id: 3,
      name: "Carton",
      abbreviation: "ctn",
      base_unit: "CTN",
      conversion_factor: 10.0,
      base: "No",
    },
    {
      id: 4,
      name: "Kilogram",
      abbreviation: "kg",
      base_unit: "KGM",
      conversion_factor: 12.0,
      base: "Yes",
    },
  ]);

  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const deleteUnit = (id: number) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  };

  const columns: ColumnDef<Unit>[] = [
    { accessorKey: "name", header: "Unit Name" },
    { accessorKey: "abbreviation", header: "Short Code" },
    { accessorKey: "base_unit", header: "Base Unit" },
    { accessorKey: "conversion_factor", header: "Factor" },
    { accessorKey: "base", header: "Base" },

    {
      header: "Actions",
      cell: ({ row }) => {
        const unit = row.original as Unit;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
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
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Units Management</h1>

        <Button onClick={() => setAddSheetOpen(true)}>+ Add Unit</Button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={units} />

      {/* Add Form */}
      <AddUnitForm
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
      />

      {/* Edit Form */}
      <EditUnitForm
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
      />
    </div>
  );
}
