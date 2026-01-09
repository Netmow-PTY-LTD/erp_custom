
import { MapEmbed } from "@/components/MapEmbed";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { type StaffAttendance } from "@/store/features/checkIn/checkIn";

export default function CheckInLocationModal({
  attendance,
  onClose,
}: {
  attendance: StaffAttendance;
  onClose: () => void;
}) {
  const hasCoords = typeof attendance.latitude === "number" && typeof attendance.longitude === "number";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-3xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-medium">Attendance Location — Staff ID: {attendance.staff_id}</h2>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm text-gray-500">Address</div>
            <div className="font-medium">{attendance.customer.address ?? "—"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Check-in Time</div>
            <div className="font-medium">{new Date(attendance.check_in_time).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Distance</div>
            <div className="font-medium">{attendance.distance_meters}m</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Coordinates</div>
            <div className="font-medium">{attendance.latitude ?? "—"}, {attendance.longitude ?? "—"}</div>
          </div>

          <div className="w-full h-64 rounded overflow-hidden border">
            {hasCoords ? (
              <div className="w-full h-full">
                <GoogleMapEmbed
                  center={{ lat: attendance.latitude, lng: attendance.longitude }}
                  zoom={16}
                  startLocation={{ lat: attendance.latitude, lng: attendance.longitude, name: `Staff ${attendance.staff_id}` }}
                  endLocation={{ lat: attendance.latitude, lng: attendance.longitude, name: `Staff ${attendance.staff_id}` }}
                  customerMarkers={[]}
                />
              </div>
            ) : (
              attendance.customer.address ? <MapEmbed location={attendance.customer.address} /> : <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">No location data available</div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg border">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
