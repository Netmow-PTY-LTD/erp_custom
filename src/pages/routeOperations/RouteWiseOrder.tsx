
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Package, DollarSign, Filter, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Expanded Dummy Data for "Lots of Orders"
const dummyRoutes = [
    {
        id: "R001",
        name: "Dhaka North Route",
        region: "Dhaka",
        orders: Array.from({ length: 50 }).map((_, i) => ({
            id: `ORD-N${1000 + i}`,
            customer: `Customer ${i + 1}`,
            amount: Math.floor(Math.random() * 10000) + 500,
            status: i % 5 === 0 ? "Delivered" : i % 3 === 0 ? "Processing" : "Pending",
            date: "2024-03-20",
        })),
    },
    {
        id: "R002",
        name: "Dhaka South Route",
        region: "Dhaka",
        orders: Array.from({ length: 35 }).map((_, i) => ({
            id: `ORD-S${2000 + i}`,
            customer: `Store ${i + 1}`,
            amount: Math.floor(Math.random() * 15000) + 1000,
            status: i % 2 === 0 ? "Pending" : "Delivered",
            date: "2024-03-21",
        })),
    },
    {
        id: "R003",
        name: "Chittagong Highway",
        region: "Chittagong",
        orders: [],
    },
    {
        id: "R004",
        name: "Sylhet Tea Garden",
        region: "Sylhet",
        orders: Array.from({ length: 12 }).map((_, i) => ({
            id: `ORD-T${3000 + i}`,
            customer: `Tea Stall ${i + 1}`,
            amount: Math.floor(Math.random() * 5000) + 200,
            status: "Pending",
            date: "2024-03-22",
        })),
    },
];

const RouteWiseOrder = () => {
    const [selectedRouteId, setSelectedRouteId] = useState<string>(dummyRoutes[0].id);
    const [routeSearch, setRouteSearch] = useState("");
    const [orderSearch, setOrderSearch] = useState("");

    const selectedRoute = dummyRoutes.find((r) => r.id === selectedRouteId);

    const filteredRoutes = dummyRoutes.filter((route) =>
        route.name.toLowerCase().includes(routeSearch.toLowerCase())
    );

    const filteredOrders = selectedRoute?.orders.filter((order) =>
        order.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase())
    );

    const totalAmount = filteredOrders?.reduce((sum, order) => sum + order.amount, 0) || 0;

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-4 p-4 overflow-hidden bg-background">
            {/* Left Sidebar: Route List */}
            <Card className="w-1/3 flex flex-col h-full border-r shadow-sm">
                <CardHeader className="pb-3 border-b bg-card">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Routes
                    </CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search routes..."
                            className="pl-8 bg-background"
                            value={routeSearch}
                            onChange={(e) => setRouteSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {filteredRoutes.map((route) => (
                            <button
                                key={route.id}
                                onClick={() => setSelectedRouteId(route.id)}
                                className={`w-full text-left p-3 rounded-lg transition-all border hover:bg-accent group
                                    ${selectedRouteId === route.id
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-card border-transparent hover:border-border"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-semibold text-sm ${selectedRouteId === route.id ? "text-primary" : "text-foreground"}`}>
                                        {route.name}
                                    </span>
                                    {route.orders.length > 0 && (
                                        <Badge variant={selectedRouteId === route.id ? "default" : "secondary"} className="text-xs">
                                            {route.orders.length}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{route.region}</span>
                                    {selectedRouteId === route.id && <ArrowRight className="h-3 w-3 animate-pulse text-primary" />}
                                </div>
                            </button>
                        ))}
                        {filteredRoutes.length === 0 && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No routes found.
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-3 border-t bg-muted/20 text-xs text-center text-muted-foreground">
                    Showing {filteredRoutes.length} routes
                </div>
            </Card>

            {/* Right Panel: Order Details */}
            <Card className="flex-1 flex flex-col h-full shadow-sm overflow-hidden">
                {selectedRoute ? (
                    <>
                        {/* Header Section */}
                        <CardHeader className="pb-4 border-b bg-card/50 backdrop-blur-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        {selectedRoute.name}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {selectedRoute.region}
                                    </CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-sm text-muted-foreground font-medium">Total Volume</div>
                                    <div className="text-2xl font-bold text-primary flex items-center">
                                        <DollarSign className="h-5 w-5 mr-1" />
                                        {totalAmount.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Toolbar */}
                            <div className="flex items-center gap-3 mt-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search orders, customers..."
                                        className="pl-8"
                                        value={orderSearch}
                                        onChange={(e) => setOrderSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 ml-auto">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filter
                                    </Button>
                                    <Button variant="default" size="sm" className="gap-2">
                                        <Package className="h-4 w-4" />
                                        Export List
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Order List Table */}
                        <div className="flex-1 overflow-auto bg-muted/5">
                            <Table>
                                <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders && filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                                                <TableCell className="font-medium text-primary">{order.id}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customer}`} />
                                                            <AvatarFallback>{order.customer.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        {order.customer}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            order.status === "Delivered" ? "default" :
                                                                order.status === "Pending" ? "outline" : "secondary"
                                                        }
                                                        className={
                                                            order.status === "Delivered" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" :
                                                                order.status === "Processing" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200" :
                                                                    "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    ${order.amount.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <Package className="h-8 w-8 mb-2 opacity-50" />
                                                    <p>No orders found matching your search.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="p-3 border-t bg-card text-xs text-muted-foreground flex justify-between">
                            <span>Total Orders: {filteredOrders?.length || 0}</span>
                            <span>Selected Route: {selectedRoute.id}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                        <MapPin className="h-16 w-16 opacity-20" />
                        <div className="text-xl font-medium">No Route Selected</div>
                        <p className="text-sm max-w-xs text-center">Select a route from the sidebar to view its orders and details.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RouteWiseOrder;
