"use client";



type Customer = {
  id: number;
  name: string;
  location: string;
  route?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
};

export default function CheckInLocationModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-medium">Check In — {customer.name}</h2>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm text-gray-500">Location</div>
            <div className="font-medium">{customer.location}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Route</div>
            <div className="font-medium">{customer.route ?? "—"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Contact</div>
            <div className="font-medium">{customer.phone ?? "—"} · {customer.email ?? "—"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Coordinates</div>
            <div className="font-medium">{customer.lat ?? "—"}, {customer.lng ?? "—"}</div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => {
                // For now just log and close — replace with real check-in action later
                // You can call attendance API or other endpoint here
                // eslint-disable-next-line no-console
                console.log("Check in for customer", customer);
                onClose();
              }}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg"
            >
              Check In
            </button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg border">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
