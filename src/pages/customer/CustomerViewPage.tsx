
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingCart,
    Pencil,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { useGetCustomerByIdQuery } from "@/store/features/customers/customersApi";
import { useAppSelector } from "@/store/store";

export default function CustomerViewPage() {
    const { customerId } = useParams();

      const currency = useAppSelector((state) => state.currency.value);
    

    const { data, isLoading, error } = useGetCustomerByIdQuery(Number(customerId));

    const customer = data?.data;

    if (isLoading) {
        return <div className="p-6">Loading customer details...</div>;
    }

    if (error || !customer) {
        return (
            <div className="p-6">
                <div className="text-red-600">Error loading customer. Please try again.</div>
            </div>
        );
    }

    const fullAddress = [
        customer.address,
        customer.city,
        customer.state,
        customer.postal_code,
        customer.country
    ].filter(Boolean).join(", ");

    return (
        <div className="w-full p-6 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Customer: {customer.name}</h1>
                <div className="flex gap-3">
                    <Link to={'/dashboard/sales/orders/create'}>
                        <Button className="flex items-center gap-2">
                            <ShoppingCart size={18} /> Create Order
                        </Button>
                    </Link>

                    <Link to={`/dashboard/customers/${customer.id}/edit`}>
                        <Button variant="secondary" className="flex items-center gap-2">
                            <Pencil size={16} /> Edit
                        </Button>
                    </Link>

                    <Link to="/dashboard/customers">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ArrowLeft size={16} /> Back
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PROFILE */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-semibold text-lg">{customer.name}</p>
                        {customer.company && (
                            <p className="text-sm text-muted-foreground">Company: {customer.company}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                            ID: {customer.id} | Type: {customer.customer_type === "business" ? "Business" : "Individual"}
                        </p>

                        <div className="pt-2 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} /> {fullAddress || "-"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} /> {customer.email || "-"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} /> {customer.phone || "-"}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ADDRESS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Address</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        {customer.address && <p>{customer.address}</p>}
                        {(customer.city || customer.state || customer.postal_code) && (
                            <p>
                                {[customer.city, customer.state, customer.postal_code].filter(Boolean).join(", ")}
                            </p>
                        )}
                        {customer.country && <p>{customer.country}</p>}
                        {!fullAddress && <p className="text-muted-foreground">No address provided</p>}
                    </CardContent>
                </Card>

                {/* ACCOUNT */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>
                            <strong>Credit Limit:</strong> {customer.credit_limit ? `${currency} ${customer.credit_limit.toLocaleString()}` : `${currency} 0`}
                        </p>
                        <p>
                            <strong>Outstanding Balance:</strong> {customer.outstanding_balance ? `${currency} ${customer.outstanding_balance.toLocaleString()}`: `${currency} 0`}
                        </p>
                        {customer.tax_id && (
                            <p>
                                <strong>Tax ID:</strong> {customer.tax_id}
                            </p>
                        )}
                        <p className="flex items-center gap-2">
                            <strong>Status:</strong>{" "}
                            <Badge
                                variant={
                                    customer.is_active ? "success" : "destructive"
                                }
                            >
                                {customer.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </p>
                    </CardContent>
                </Card>

                {/* NOTES */}
                {customer.notes && (
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{customer.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {/* LOCATION */}
                {(customer.latitude && customer.longitude) && (
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                <strong>Coordinates:</strong> {customer.latitude}, {customer.longitude}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
