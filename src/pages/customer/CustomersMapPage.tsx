// CustomersMapPage.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

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

// Type for customer
interface Customer {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

const CustomersMapPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        // Dummy API data
        const dummyData: Customer[] = [
            { id: 1, name: "John Doe", address: "Dhaka", latitude: 23.8103, longitude: 90.4125 },
            { id: 2, name: "Jane Smith", address: "Chittagong", latitude: 22.3569, longitude: 91.7832 },
            { id: 3, name: "Alice Johnson", address: "Khulna", latitude: 22.8456, longitude: 89.5403 },
        ];

        setCustomers(dummyData);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Customers Map</h1>

            <MapContainer
                center={[23.8103, 90.4125]} // Default center
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
                            position={[customer.latitude, customer.longitude]}
                        >
                            <Popup>
                                <strong>{customer.name}</strong>
                                <br />
                                {customer.address}
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default CustomersMapPage;
