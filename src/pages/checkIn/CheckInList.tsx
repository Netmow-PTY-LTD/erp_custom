import { useState, useMemo, type JSX } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import CheckInLocationModal from "./CheckInLocationModal";
import { useGetCheckinListQuery, type AttendanceItem } from "@/store/features/checkIn/checkIn";

/* ================= COMPONENT ================= */

export default function CheckInList(): JSX.Element {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [locationItem, setLocationItem] = useState<AttendanceItem | null>(null);

  const { data: response, isFetching, isLoading } = useGetCheckinListQuery({
    page,
    limit,
    // Add search if API supports it, for now we filter client-side if needed
    // or pass it if the API handles it as staff_id or date
  });

  const checkInItems = useMemo(() => response?.data || [], [response]);
  const totalCount = useMemo(() => response?.pagination?.total || 0, [response]);

  /* ================= FILTER (Client-side search as fallback) ================= */
  const filteredItems = useMemo(() => {
    if (!search) return checkInItems;

    const s = search.toLowerCase();
    return checkInItems.filter(
      (item) =>
        item.staff?.first_name.toLowerCase().includes(s) ||
        item.staff?.last_name.toLowerCase().includes(s) ||
        item.customer?.name.toLowerCase().includes(s) ||
        item.customer?.location.toLowerCase().includes(s) ||
        item.notes?.toLowerCase().includes(s)
    );
  }, [search, checkInItems]);

  /* ================= TABLE COLUMNS ================= */

  const columns = useMemo<ColumnDef<AttendanceItem>[]>(
    () => [
      {
        accessorKey: "staff",
        header: "Staff Member",
        cell: ({ row }) => {
          const staff = row.original.staff;
          return staff ? `${staff.first_name} ${staff.last_name}` : "—";
        },
      },
      {
        accessorKey: "customer.name",
        header: "Customer",
        cell: ({ row }) => row.original.customer?.name || "—",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "check_in",
        header: "Check-in Time",
        cell: ({ row }) => row.original.check_in || "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${row.original.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
            {row.original.status || "—"}
          </span>
        ),
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) =>
          row.original.latitude && row.original.longitude
            ? `${row.original.latitude.toFixed(4)}, ${row.original.longitude.toFixed(4)}`
            : row.original.customer?.location || "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="border px-3 py-1 rounded hover:bg-gray-100 text-sm"
            onClick={() => setLocationItem(row.original)}
          >
            View Details
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
          data={filteredItems}
          pageIndex={page - 1}
          pageSize={limit}
          totalCount={totalCount}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          isFetching={isFetching || isLoading}
        />
      </div>

      {locationItem && (
        <CheckInLocationModal
          customer={{
            id: locationItem.customer?.id || 0,
            name: locationItem.customer?.name || (locationItem.staff ? `${locationItem.staff.first_name} ${locationItem.staff.last_name}` : "Unknown"),
            location: locationItem.customer?.location || "Unknown",
            lat: locationItem.latitude,
            lng: locationItem.longitude,
            phone: locationItem.customer?.phone,
            email: locationItem.customer?.email,
          }}
          onClose={() => setLocationItem(null)}
        />
      )}
    </div>
  );
}









//   previous version


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useMemo, type JSX } from "react";
// import type { ColumnDef } from "@tanstack/react-table";
// import { DataTable } from "@/components/dashboard/components/DataTable";
// import CheckInLocationModal from "./CheckInLocationModal";

// /* ================= TYPES ================= */

// type Customer = {
//   image: string | undefined;
//   id: number;
//   name: string;
//   location: string;
//   route?: string;
//   phone?: string;
//   email?: string;
//   lat?: number;
//   lng?: number;
// };

// /* ================= SAMPLE DATA (REPLACE WITH API LATER) ================= */

// const customersData: Customer[] = [
//   {
//     id: 1,
//     image: undefined,
//     name: "Restaurant Hakim",
//     location: "Shah Alam",
//     route: "Route A",
//     phone: "+60 12-345 6789",
//     email: "hakim@restaurant.com",
//     lat: 3.0738,
//     lng: 101.5183,
//   },
// ];

// /* ================= COMPONENT ================= */

// export default function CheckInList(): JSX.Element {
//   const [customers] = useState<Customer[]>(customersData);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [locationCustomer, setLocationCustomer] = useState<Customer | null>(null);

//   /* ================= FILTER ================= */

//   const filteredCustomers = useMemo(() => {
//     if (!search) return customers;

//     const s = search.toLowerCase();
//     return customers.filter(
//       (c) =>
//         String(c.id).includes(s) ||
//         c.name.toLowerCase().includes(s) ||
//         c.location.toLowerCase().includes(s) ||
//         (c.route && c.route.toLowerCase().includes(s))
//     );
//   }, [search, customers]);

//   /* ================= TABLE COLUMNS ================= */

//   const columns = useMemo<ColumnDef<Customer>[]>(
//     () => [
//       { accessorKey: "image", header: "Image", 
//         cell: ({ row }) => <img src={row.original.image} alt="Customer" className="w-10 h-10 rounded-full object-cover" /> },
//       { accessorKey: "name", header: "Name" },
//       { accessorKey: "location", header: "Location" },
//       { accessorKey: "route", header: "Route" },
//       { accessorKey: "phone", header: "Phone" },
//       { accessorKey: "email", header: "Email" },
//       {
//         id: "coords",
//         header: "Coordinates",
//         cell: ({ row }) =>
//           row.original.lat
//             ? `${row.original.lat}, ${row.original.lng}`
//             : "—",
//       },
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => (
//           <button
//             className="border px-3 py-1 rounded hover:bg-gray-100"
//             onClick={() => setLocationCustomer(row.original)}
//           >
//             View Location
//           </button>
//         ),
//       },
//     ],
//     []
//   );

//   /* ================= UI ================= */

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-semibold">Check In List</h1>

//       <div className="bg-white shadow rounded-lg">
//         <DataTable
//           columns={columns}
//           data={filteredCustomers}
//           pageIndex={page - 1}
//           pageSize={limit}
//           totalCount={filteredCustomers.length}
//           onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
//           onSearch={(value) => {
//             setSearch(value);
//             setPage(1);
//           }}
//           isFetching={false}
//         />
//       </div>

//       {locationCustomer && (
//         <CheckInLocationModal
//           customer={locationCustomer}
//           onClose={() => setLocationCustomer(null)}
//         />
//       )}
//     </div>
//   );
// }