
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type JSX } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { toast } from "sonner";
import CheckInLocationModal from "./CheckInLocationModal";
import type { ColumnDef } from "@tanstack/react-table";
import { useStaffCheckInMutation } from "@/store/features/checkIn/checkIn";
import { useGetActiveCustomersQuery } from "@/store/features/customers/customersApi";
import type { Customer } from "@/store/features/customers/types";



type CheckIn = {
  id: string;
  customerId: number | string;
  staffName: string;
  time: string; // ISO
  note?: string;
};



export default function CheckIn(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch customers with pagination and search
  const { data: customerData, isLoading: customersLoading, error: customersError } = useGetActiveCustomersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
  });

  const [attendanceResult, setAttendanceResult] = useState<any>(null);
  const [check_in, { isLoading: isSubmitting }] = useStaffCheckInMutation();

  const customers = customerData?.data || [];
  const totalCount = customerData?.pagination?.total || 0;


const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "thumb_url",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.original.thumb_url || "/placeholder.png"}
        alt={row.original.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Location",
  },
  {
    accessorKey: "sales_route_id",
    header: "Route ID",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "coords",
    header: "Coordinates",
    cell: ({ row }) =>
      row.original.latitude && row.original.longitude
        ? `${row.original.latitude}, ${row.original.longitude}`
        : "—",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => handleCheckIn(customer)}
          >
            Check In
          </button>
          <button
            className="border px-3 py-1 rounded"
            // onClick={() => setLocationCustomer(customer)}
          >
            View Location
          </button>
        </div>
      );
    },
  },
];


  // RTK Query Mutation for creating check-in
  // const [createCheckIn, { isLoading: isSubmitting }] = useCreateCheckInMutation();

  function handleCheckIn(customer: Customer) {
    if (!customer.latitude || !customer.longitude) {
      toast.error("Customer location not available.");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const distance = haversineDistanceMeters(latitude, longitude, customer.latitude!, customer.longitude!);

        if (distance > 100) {
          toast.error(`Please go to the exact location. Distance is ${Math.round(distance)} m.`);
          return;
        }

        const payload = {
          customer_id: customer.id,
          staff_id: 123, // replace with your logged-in staff ID
          check_in_time: new Date().toISOString(),
          latitude,
          longitude,
          distance_meters: Math.round(distance),
          note: "Checked in from mobile app",
        };

        console.log("CHECK-IN PAYLOAD:", payload);

        try {
          const res = await check_in(payload).unwrap();
          toast.success("Check-in successful!");
          setAttendanceResult(res.data);
        } catch (err: any) {
          toast.error(err?.data?.message || "Check-in failed");
        }
      },
      (err) => {
        toast.error(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  }

  function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }



  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Check In</h1>

      <h1 className="text-2xl font-semibold mb-4">Check In</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {customersError ? (
          <div className="p-4 text-red-600 text-center">Error loading customers: {(customersError as any)?.data?.message || "Something went wrong"}</div>
        ) : (
          <DataTable
            columns={customerColumns}
            data={customers}
            pageIndex={currentPage - 1}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={(newPageIndex) => setCurrentPage(newPageIndex + 1)}
            onSearch={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            isFetching={customersLoading || isSubmitting}
          />
        )}
      </div>

      {attendanceResult && (
        <CheckInLocationModal
          attendance={attendanceResult}
          onClose={() => setAttendanceResult(null)}
        />
      )}
    </div>
  );
}






















// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useMemo, type JSX } from "react";
// import { DataTable } from "@/components/dashboard/components/DataTable";
// import type { ColumnDef } from "@tanstack/react-table";
// import { useGetCheckinListQuery } from "@/store/baseApi";
// import CheckInLocationModal from "./CheckInLocationModal";


// type Customer = {
//     image: string | undefined;
// 	id: number;
// 	name: string;
// 	location: string;
// 	route?: string;
// 	phone?: string;
// 	email?: string;
// 	lat?: number;
// 	lng?: number;
// };

// type CheckIn = {
// 	id: string;
// 	customerId: number | string;
// 	staffName: string;
// 	time: string; // ISO
// 	note?: string;
// };

// const sampleCustomers: Customer[] = [
// 	{
// 		id: 1,
//         image: undefined,
// 		name: "Restaurant Hakim",
// 		location: "Shah Alam",
// 		route: "Route A",
// 		phone: "+60 12-345 6789",
// 		email: "hakim@restaurant.com",
// 		lat: 3.0738,
// 		lng: 101.5183,
// 	},
// ];

// const initialCheckIns: CheckIn[] = [
// 	{ id: "i1", customerId: "c1", staffName: "John Doe", time: new Date().toISOString(), note: "Visited front desk" },
// 	{ id: "i2", customerId: "c2", staffName: "Jane Smith", time: new Date().toISOString(), note: "Left samples" },
// ];

// export default function CheckIn(): JSX.Element {
// 	const [customers] = useState<Customer[]>(sampleCustomers);
// 	const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
// 	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
// 	const [showModal, setShowModal] = useState(false);
// 	const [staffFilterInput, setStaffFilterInput] = useState<string>("");
// 	const [dateFilterInput, setDateFilterInput] = useState<string>("");
// 	const [fetchParams, setFetchParams] = useState<{ staff_id?: string | number; date?: string } | null>(null);

// 	// DataTable states for customers
// 	const [search, setSearch] = useState("");
// 	const [page, setPage] = useState(1);
// 	const [limit] = useState(10);

// 	const filteredCustomers = useMemo(() => {
// 		if (!search) return customers;
// 		const s = search.toLowerCase();
// 		return customers.filter(
// 			(c) =>
// 				String(c.id).includes(s) ||
// 				c.name.toLowerCase().includes(s) ||
// 				(c.location && c.location.toLowerCase().includes(s)) ||
// 				(c.route && c.route.toLowerCase().includes(s))
// 		);
// 	}, [search, customers]);

// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	const customerColumns = useMemo<ColumnDef<Customer>[]>(
// 		() => [
//              { accessorKey: "image", header: "Image", 
//         cell: ({ row }) => <img src={row.original.image} alt="Customer" className="w-10 h-10 rounded-full object-cover" /> },
// 			{ accessorKey: "name", header: "Name" },

// 			{ accessorKey: "location", header: "Location" },
// 			{ accessorKey: "route", header: "Route" },
// 			{ accessorKey: "phone", header: "Phone" },
// 			{ accessorKey: "email", header: "Email" },
// 			{
// 				id: "coords",
// 				header: "Coordinates",
// 				cell: (info) => (info.row.original.lat ? `${info.row.original.lat}, ${info.row.original.lng}` : "—"),
// 			},
// 			{
// 				id: "actions",
// 				header: "Actions",
// 				cell: ({ row }) => (
// 					<div>
// 						<button className="bg-blue-600 text-white px-3 py-1 rounded mr-2" onClick={() => handleCheckIn(row.original)}>
// 							Check In
// 						</button>
// 						<button className="border px-3 py-1 rounded" onClick={() => setLocationCustomer(row.original)}>
// 							View Location
// 						</button>
// 					</div>
// 				),
// 			},
// 		],
// 		[]
// 	);

// 	function handleOpenList(customer: Customer) {
// 		setSelectedCustomer(customer);
// 		setShowModal(true);
// 	}

// 	function handleClose() {
// 		setShowModal(false);
// 		setSelectedCustomer(null);
// 	}

// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	// function handleCheckIn(customer: Customer) {
// 	// 	// perform geolocation check then add check-in if within threshold
// 	// 	if (!customer.lat || !customer.lng) {
// 	// 		setMessage({ type: "error", text: "Customer location not available." });
// 	// 		return;
// 	// 	}

// 	// 	const doCheckIn = (pos: GeolocationPosition) => {
// 	// 		const { latitude, longitude } = pos.coords;
// 	// 		const dist = haversineDistanceMeters(latitude, longitude, customer.lat!, customer.lng!);
// 	// 		const thresholdMeters = 100; // acceptable distance in meters
// 	// 		if (dist <= thresholdMeters) {
// 	// 			const newCheckIn: CheckIn = {
					 
// 	// 				id: `i_${Date.now()}`,
// 	// 				customerId: customer.id,
// 	// 				staffName: "Current User",
// 	// 				time: new Date().toISOString(),
// 	// 			};
// 	// 			setCheckIns((s) => [newCheckIn, ...s]);
// 	// 			setMessage({ type: "success", text: "Check-in successful." });
// 	// 			handleOpenList(customer);
// 	// 		} else {
// 	// 			setMessage({ type: "error", text: `Please go to the exact location. Distance is ${Math.round(dist)} m.` });
// 	// 		}
// 	// 	};

// 	// 	const onError = (err: GeolocationPositionError) => {
// 	// 		setMessage({ type: "error", text: `Unable to get current location: ${err.message}` });
// 	// 	};

// 	// 	if (navigator.geolocation) {
// 	// 		navigator.geolocation.getCurrentPosition(doCheckIn, onError, { enableHighAccuracy: true, timeout: 10000 });
// 	// 	} else {
// 	// 		setMessage({ type: "error", text: "Geolocation is not supported by this browser." });
// 	// 	}
// 	// }

//     function handleCheckIn(customer: Customer) {
//   if (!customer.lat || !customer.lng) {
//     setMessage({ type: "error", text: "Customer location not available." });
//     return;
//   }

//   if (!navigator.geolocation) {
//     setMessage({ type: "error", text: "Geolocation not supported." });
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     async (pos) => {
//       const { latitude, longitude } = pos.coords;

//       const distance = haversineDistanceMeters(
//         latitude,
//         longitude,
//         customer.lat!,
//         customer.lng!
//       );

//       if (distance > 100) {
//         setMessage({
//           type: "error",
//           text: `Please go to the exact location. Distance is ${Math.round(distance)} m.`,
//         });
//         return;
//       }

//       const payload = {
//         customer_id: customer.id,
//         staff_id: 123, // replace with auth user id
//         check_in_time: new Date().toISOString(),
//         latitude,
//         longitude,
//         distance_meters: Math.round(distance),
//         note: "Checked in",
//       };

//       console.log("CHECK-IN PAYLOAD:", payload);

//       //  API CALL
//       // await createCheckIn(payload).unwrap();

//       setMessage({ type: "success", text: "Check-in successful" });
//     },
//     (err) => {
//       setMessage({
//         type: "error",
//         text: `Location error: ${err.message}`,
//       });
//     },
//     { enableHighAccuracy: true }
//   );
// }


// 	// helper: haversine distance in meters
// 	function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
// 		const toRad = (v: number) => (v * Math.PI) / 180;
// 		const R = 6371000; // metres
// 		const dLat = toRad(lat2 - lat1);
// 		const dLon = toRad(lon2 - lon1);
// 		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
// 		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// 		return R * c;
// 	}

// 	// view location modal
// 	const [locationCustomer, setLocationCustomer] = useState<Customer | null>(null);

// 	// simple message banner
// 	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

// 	// RTK Query for attendance check-in list
// 	const { data: apiData, isLoading: apiLoading, isError: apiError } = useGetCheckinListQuery(
// 		fetchParams ?? undefined,
// 		{ skip: !fetchParams }
// 	);

// 	// typed view of API response
// 	type AttendanceItemApi = {
// 		id: number;
// 		staff_id?: number;
// 		date?: string;
// 		check_in?: string | null;
// 		check_out?: string | null;
// 		status?: string | null;
// 		notes?: string | null;
// 		staff?: { id: number; first_name: string; last_name: string; email?: string };
// 	};

// 	type ApiResponse = {
// 		success?: boolean;
// 		message?: string;
// 		pagination?: { total: number; page: number; limit: number; totalPage: number };
// 		data?: AttendanceItemApi[];
// 	} | undefined;

// 	const api = apiData as ApiResponse;

// 	// `customerRows` removed: using DataTable for rendering

// 	const selectedCheckIns = selectedCustomer
// 		? checkIns.filter((ci) => ci.customerId === selectedCustomer.id)
// 		: [];

// 	return (
// 		<div className="p-6">
// 			<h1 className="text-2xl font-semibold mb-4">Check In</h1>

// 			{message && (
// 				<div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
// 					{message.text}
// 				</div>
// 			)}

// 			<div className="overflow-x-auto bg-white shadow rounded-lg">
// 				<DataTable
// 					columns={customerColumns}
// 					data={filteredCustomers}
// 					pageIndex={page - 1}
// 					pageSize={limit}
// 					totalCount={filteredCustomers.length}
// 					onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
// 					onSearch={(value) => {
// 						setSearch(value);
// 						setPage(1);
// 					}}
// 					isFetching={false}
// 				/>
// 			</div>

// 			{showModal && selectedCustomer && (
// 				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
// 					<div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl">
// 						<div className="flex items-center justify-between px-4 py-3 border-b">
// 							<h2 className="text-lg font-medium">Check-ins — {selectedCustomer.name}</h2>
// 							<div>
// 								<button
// 									className="mr-2 px-3 py-1 border rounded"
// 									onClick={() => {
// 										// allow quick check-in from modal
// 										handleCheckIn(selectedCustomer);
// 									}}
// 								>
// 									Check In Now
// 								</button>
// 								<button className="px-3 py-1 bg-gray-200 rounded" onClick={handleClose}>
// 									Close
// 								</button>
// 							</div>
// 						</div>
// 						<div className="p-4">
// 							{/* Filters for attendance API */}
// 							<div className="mb-4 grid grid-cols-3 gap-2 items-end">
// 								<div>
// 									<label className="block text-sm text-gray-600">Staff ID</label>
// 									<input
// 										type="text"
// 										value={staffFilterInput}
// 										onChange={(e) => setStaffFilterInput(e.target.value)}
// 										className="mt-1 block w-full border px-2 py-1 rounded"
// 									/>
// 								</div>
// 								<div>
// 									<label className="block text-sm text-gray-600">Date</label>
// 									<input
// 										type="date"
// 										value={dateFilterInput}
// 										onChange={(e) => setDateFilterInput(e.target.value)}
// 										className="mt-1 block w-full border px-2 py-1 rounded"
// 									/>
// 								</div>
// 								<div>
// 									<button
// 										className="px-3 py-1 bg-blue-600 text-white rounded"
// 										onClick={() => setFetchParams({ staff_id: staffFilterInput || undefined, date: dateFilterInput || undefined })}
// 									>
// 										Load
// 									</button>
// 									<button
// 										className="ml-2 px-3 py-1 bg-gray-200 rounded"
// 										onClick={() => {
// 											setStaffFilterInput("");
// 											setDateFilterInput("");
// 											setFetchParams(null);
// 										}}
// 									>
// 										Clear
// 									</button>
// 								</div>
// 							</div>
// 							{/* API results (if any) else fallback to local check-ins */}
// 										{apiLoading ? (
// 											<p className="text-sm text-gray-600">Loading...</p>
// 										) : apiError ? (
// 											<p className="text-sm text-red-600">Error loading check-ins.</p>
// 										) : api && api.data && api.data.length > 0 ? (
// 											<ul className="space-y-2">
// 												{api.data.map((ci) => (
// 													<li key={ci.id} className="p-2 border rounded">
// 														<div className="text-sm font-semibold">{ci.staff?.first_name} {ci.staff?.last_name}</div>
// 														<div className="text-xs text-gray-600">{ci.date} {ci.check_in ? ` · ${ci.check_in}` : ''}</div>
// 														{ci.notes && <div className="text-sm mt-1">{ci.notes}</div>}
// 													</li>
// 												))}
// 											</ul>
// 										) : (
// 								// fallback to local checkins for this customer
// 								selectedCheckIns.length === 0 ? (
// 									<p className="text-sm text-gray-600">No check-ins yet for this customer.</p>
// 								) : (
// 									<ul className="space-y-2">
// 										{selectedCheckIns.map((ci) => (
// 											<li key={ci.id} className="p-2 border rounded">
// 												<div className="text-sm font-semibold">{ci.staffName}</div>
// 												<div className="text-xs text-gray-600">{new Date(ci.time).toLocaleString()}</div>
// 												{ci.note && <div className="text-sm mt-1">{ci.note}</div>}
// 											</li>
// 										))}
// 									</ul>
// 								)
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 		{locationCustomer && (
// 			<CheckInLocationModal customer={locationCustomer} onClose={() => setLocationCustomer(null)} />
// 		)}
// 		</div>
// 	);
// }

