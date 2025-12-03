// CustomersMapPage.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useGetCustomerMapsQuery } from "@/store/features/customers/customersApi";

// Fix default Leaflet marker icon issue in TypeScript
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const CustomersMapPage: React.FC = () => {
    const { data, isLoading, error } = useGetCustomerMapsQuery();

    const customers = data?.data.locations || [];
    const total = data?.data.total || 0;

    // Default center (if no customers)
    const defaultCenter: [number, number] = [23.8103, 90.4125];

    // Calculate center from customers if available
    const center: [number, number] = customers.length > 0
        ? [customers[0].coordinates.lat, customers[0].coordinates.lng]
        : defaultCenter;

    if (isLoading) {
        return <div className="p-4">Loading customer locations...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error loading customer locations.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Customers Map ({total} locations)</h1>

            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={true}
                className="w-full h-[600px] rounded-lg shadow"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <MarkerClusterGroup>
                    {customers.map((customer) => (
                        <Marker
                            key={customer.id}
                            position={[customer.coordinates.lat, customer.coordinates.lng]}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <strong>{customer.name}</strong>
                                    {customer.company && <><br />{customer.company}</>}
                                    <br />{customer.address || "-"}
                                    {customer.city && <><br />{customer.city}</>}
                                    {customer.phone && <><br />📱 {customer.phone}</>}
                                    {customer.email && <><br />✉️ {customer.email}</>}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            {customers.length === 0 && !isLoading && (
                <p className="text-center mt-4 text-muted-foreground">
                    No customer locations available
                </p>
            )}
        </div>
    );
};

export default CustomersMapPage;
