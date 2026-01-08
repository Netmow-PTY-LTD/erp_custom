/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, type JSX } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import CheckInLocationModal from "./CheckInLocationModal";

/* ================= TYPES ================= */

type Customer = {
  image: string | undefined;
  id: number;
  name: string;
  location: string;
  route?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
};

/* ================= SAMPLE DATA (REPLACE WITH API LATER) ================= */

const customersData: Customer[] = [
  {
    id: 1,
    image: undefined,
    name: "Restaurant Hakim",
    location: "Shah Alam",
    route: "Route A",
    phone: "+60 12-345 6789",
    email: "hakim@restaurant.com",
    lat: 3.0738,
    lng: 101.5183,
  },
];

/* ================= COMPONENT ================= */

export default function CheckInList(): JSX.Element {
  const [customers] = useState<Customer[]>(customersData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [locationCustomer, setLocationCustomer] = useState<Customer | null>(null);

  /* ================= FILTER ================= */

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;

    const s = search.toLowerCase();
    return customers.filter(
      (c) =>
        String(c.id).includes(s) ||
        c.name.toLowerCase().includes(s) ||
        c.location.toLowerCase().includes(s) ||
        (c.route && c.route.toLowerCase().includes(s))
    );
  }, [search, customers]);

  /* ================= TABLE COLUMNS ================= */

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      { accessorKey: "image", header: "Image", 
        cell: ({ row }) => <img src={row.original.image} alt="Customer" className="w-10 h-10 rounded-full object-cover" /> },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "location", header: "Location" },
      { accessorKey: "route", header: "Route" },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "email", header: "Email" },
      {
        id: "coords",
        header: "Coordinates",
        cell: ({ row }) =>
          row.original.lat
            ? `${row.original.lat}, ${row.original.lng}`
            : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="border px-3 py-1 rounded hover:bg-gray-100"
            onClick={() => setLocationCustomer(row.original)}
          >
            View Location
          </button>
        ),
      },
    ],
    []
  );

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Check In List</h1>

      <div className="bg-white shadow rounded-lg">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          pageIndex={page - 1}
          pageSize={limit}
          totalCount={filteredCustomers.length}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          isFetching={false}
        />
      </div>

      {locationCustomer && (
        <CheckInLocationModal
          customer={locationCustomer}
          onClose={() => setLocationCustomer(null)}
        />
      )}
    </div>
  );
}
