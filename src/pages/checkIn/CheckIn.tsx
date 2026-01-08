/* eslint-disable @typescript-eslint/no-explicit-any */


import  { useState } from "react";
import { useGetCheckinListQuery } from "@/store/baseApi";

type Customer = {
	id: string;
	name: string;
	address: string;
	lat?: number;
	lng?: number;
};

type CheckIn = {
	id: string;
	customerId: string;
	staffName: string;
	time: string; // ISO
	note?: string;
};

const sampleCustomers: Customer[] = [
	{ id: "c1", name: "Acme Supplies", address: "12 Market St, Springfield", lat: 40.7128, lng: -74.006 },
	{ id: "c2", name: "Beta Retail", address: "88 Industrial Rd, Centerville", lat: 34.0522, lng: -118.2437 },
	{ id: "c3", name: "Gamma Traders", address: "7 High St, Lakeside", lat: 51.5074, lng: -0.1278 },
];

const initialCheckIns: CheckIn[] = [
	{ id: "i1", customerId: "c1", staffName: "John Doe", time: new Date().toISOString(), note: "Visited front desk" },
	{ id: "i2", customerId: "c2", staffName: "Jane Smith", time: new Date().toISOString(), note: "Left samples" },
];

export default function CheckIn() {
	const [customers] = useState<Customer[]>(sampleCustomers);
	const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [staffFilterInput, setStaffFilterInput] = useState<string>("");
	const [dateFilterInput, setDateFilterInput] = useState<string>("");
	const [fetchParams, setFetchParams] = useState<{ staff_id?: string | number; date?: string } | null>(null);

	function handleOpenList(customer: Customer) {
		setSelectedCustomer(customer);
		setShowModal(true);
	}

	function handleClose() {
		setShowModal(false);
		setSelectedCustomer(null);
	}

	function handleCheckIn(customer: Customer) {
		const newCheckIn: CheckIn = {
			// eslint-disable-next-line react-hooks/purity
			id: `i_${Date.now()}`,
			customerId: customer.id,
			staffName: "Current User", // replace with real user from context
			time: new Date().toISOString(),
		};
		setCheckIns((s) => [newCheckIn, ...s]);
		// after check-in, open list for that customer
		handleOpenList(customer);
	}

	// RTK Query for attendance check-in list
	const { data: apiData, isLoading: apiLoading, isError: apiError } = useGetCheckinListQuery(
		fetchParams ?? undefined,
		{ skip: !fetchParams }
	);

	const customerRows = customers.map((c) => (
		<tr key={c.id} className="even:bg-gray-50">
			<td className="px-4 py-2">{c.name}</td>
			<td className="px-4 py-2">{c.address}</td>
			<td className="px-4 py-2">{c.lat ? `${c.lat}, ${c.lng}` : "—"}</td>
			<td className="px-4 py-2">
				<button
					className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
					onClick={() => handleCheckIn(c)}
				>
					Check In
				</button>
				<button className="border px-3 py-1 rounded" onClick={() => handleOpenList(c)}>
					View Check-ins
				</button>
			</td>
		</tr>
	));

	const selectedCheckIns = selectedCustomer
		? checkIns.filter((ci) => ci.customerId === selectedCustomer.id)
		: [];

	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold mb-4">Check In</h1>

			<div className="overflow-x-auto bg-white shadow rounded-lg">
				<table className="w-full border-collapse">
					<thead className="bg-gray-100">
						<tr>
							<th className="text-left px-4 py-2">Customer</th>
							<th className="text-left px-4 py-2">Address</th>
							<th className="text-left px-4 py-2">Coordinates</th>
							<th className="text-left px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>{customerRows}</tbody>
				</table>
			</div>

			{showModal && selectedCustomer && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl">
						<div className="flex items-center justify-between px-4 py-3 border-b">
							<h2 className="text-lg font-medium">Check-ins — {selectedCustomer.name}</h2>
							<div>
								<button
									className="mr-2 px-3 py-1 border rounded"
									onClick={() => {
										// allow quick check-in from modal
										handleCheckIn(selectedCustomer);
									}}
								>
									Check In Now
								</button>
								<button className="px-3 py-1 bg-gray-200 rounded" onClick={handleClose}>
									Close
								</button>
							</div>
						</div>
						<div className="p-4">
							{/* Filters for attendance API */}
							<div className="mb-4 grid grid-cols-3 gap-2 items-end">
								<div>
									<label className="block text-sm text-gray-600">Staff ID</label>
									<input
										type="text"
										value={staffFilterInput}
										onChange={(e) => setStaffFilterInput(e.target.value)}
										className="mt-1 block w-full border px-2 py-1 rounded"
									/>
								</div>
								<div>
									<label className="block text-sm text-gray-600">Date</label>
									<input
										type="date"
										value={dateFilterInput}
										onChange={(e) => setDateFilterInput(e.target.value)}
										className="mt-1 block w-full border px-2 py-1 rounded"
									/>
								</div>
								<div>
									<button
										className="px-3 py-1 bg-blue-600 text-white rounded"
										onClick={() => setFetchParams({ staff_id: staffFilterInput || undefined, date: dateFilterInput || undefined })}
									>
										Load
									</button>
									<button
										className="ml-2 px-3 py-1 bg-gray-200 rounded"
										onClick={() => {
											setStaffFilterInput("");
											setDateFilterInput("");
											setFetchParams(null);
										}}
									>
										Clear
									</button>
								</div>
							</div>
							{/* API results (if any) else fallback to local check-ins */}
							{apiLoading ? (
								<p className="text-sm text-gray-600">Loading...</p>
							) : apiError ? (
								<p className="text-sm text-red-600">Error loading check-ins.</p>
							) : apiData && (apiData as any).data && (apiData as any).data.length > 0 ? (
								<ul className="space-y-2">
									{(apiData as any).data.map((ci: any) => (
										<li key={ci.id} className="p-2 border rounded">
											<div className="text-sm font-semibold">{ci.staff?.first_name} {ci.staff?.last_name}</div>
											<div className="text-xs text-gray-600">{ci.date} {ci.check_in ? ` · ${ci.check_in}` : ''}</div>
											{ci.notes && <div className="text-sm mt-1">{ci.notes}</div>}
										</li>
									))}
								</ul>
							) : (
								// fallback to local checkins for this customer
								selectedCheckIns.length === 0 ? (
									<p className="text-sm text-gray-600">No check-ins yet for this customer.</p>
								) : (
									<ul className="space-y-2">
										{selectedCheckIns.map((ci) => (
											<li key={ci.id} className="p-2 border rounded">
												<div className="text-sm font-semibold">{ci.staffName}</div>
												<div className="text-xs text-gray-600">{new Date(ci.time).toLocaleString()}</div>
												{ci.note && <div className="text-sm mt-1">{ci.note}</div>}
											</li>
										))}
									</ul>
								)
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

