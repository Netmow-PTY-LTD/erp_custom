
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Phone, Mail, Truck, User, ArrowRight, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Enhanced Mock Data Generator
const generateDummyData = () => {
    const roles = ["Sales Representative", "Delivery Driver", "Area Manager"];
    const regions = ["Dhaka North", "Dhaka South", "Chittagong", "Sylhet", "Rajshahi", "Khulna"];

    return Array.from({ length: 25 }).map((_, i) => {
        const role = roles[i % 3];
        const routeCount = Math.floor(Math.random() * 15) + 3; // 3 to 18 routes
        const routes = Array.from({ length: routeCount }).map((_, j) => ({
            id: `R-${i}-${j}`,
            name: `${regions[j % regions.length]} - Sector ${j + 1}`,
            status: Math.random() > 0.3 ? "Active" : "Pending",
            orders: Math.floor(Math.random() * 50) + 5
        }));

        return {
            id: `S${1000 + i}`,
            name: `Staff Member ${i + 1}`,
            role: role,
            email: `staff${i + 1}@example.com`,
            phone: `+880 1700-000${i.toString().padStart(3, '0')}`,
            active: i % 5 !== 0, // 20% inactive
            routes: routes,
            stats: {
                completedOrders: Math.floor(Math.random() * 1000),
                rating: (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
            }
        };
    });
};

const dummyStaffList = generateDummyData();

const StaffRoute = () => {
    const [selectedStaffId, setSelectedStaffId] = useState<string>(dummyStaffList[0].id);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState<string | null>(null);

    const filteredStaff = dummyStaffList.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole ? staff.role === filterRole : true;
        return matchesSearch && matchesRole;
    });

    const selectedStaff = dummyStaffList.find(s => s.id === selectedStaffId);

    // Calculate summary stats for selected staff
    const totalOrders = selectedStaff?.routes.reduce((acc, r) => acc + r.orders, 0) || 0;


    return (
        <div className="flex h-[calc(100vh-6rem)] gap-4 p-4 overflow-hidden bg-background">
            {/* Left Sidebar: Staff List */}
            <Card className="w-1/3 min-w-[300px] flex flex-col h-full border-r shadow-sm">
                <CardHeader className="pb-3 border-b bg-card">
                    <CardTitle className="text-xl font-bold flex items-center justify-between">
                        <span>Staff Directory</span>
                        <Badge variant="outline" className="text-xs font-normal">
                            {filteredStaff.length} Members
                        </Badge>
                    </CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or ID..."
                            className="pl-8 bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Simple Filter Pills */}
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                        <Button
                            variant={filterRole === null ? "default" : "outline"}
                            size="xs"
                            className="h-7 text-xs rounded-full"
                            onClick={() => setFilterRole(null)}
                        >
                            All
                        </Button>
                        <Button
                            variant={filterRole === "Sales Representative" ? "default" : "outline"}
                            size="xs"
                            className="h-7 text-xs rounded-full whitespace-nowrap"
                            onClick={() => setFilterRole("Sales Representative")}
                        >
                            Sales Rep
                        </Button>
                        <Button
                            variant={filterRole === "Delivery Driver" ? "default" : "outline"}
                            size="xs"
                            className="h-7 text-xs rounded-full whitespace-nowrap"
                            onClick={() => setFilterRole("Delivery Driver")}
                        >
                            Drivers
                        </Button>
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1 bg-muted/5">
                    <div className="flex flex-col p-2 gap-1">
                        {filteredStaff.map((staff) => (
                            <button
                                key={staff.id}
                                onClick={() => setSelectedStaffId(staff.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all hover:bg-accent group
                                    ${selectedStaffId === staff.id ? "bg-accent border-l-4 border-l-primary shadow-sm pl-2" : "border-l-4 border-l-transparent"}
                                `}
                            >
                                <Avatar className="h-10 w-10 border bg-background">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                                    <AvatarFallback>{staff.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className={`font-semibold text-sm truncate ${selectedStaffId === staff.id ? "text-primary" : "text-foreground"}`}>
                                            {staff.name}
                                        </span>
                                        {!staff.active && (
                                            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" title="Inactive" />
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground truncate gap-1">
                                        {staff.role === "Delivery Driver" ? <Truck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                        <span className="truncate">{staff.role}</span>
                                    </div>
                                </div>
                                {selectedStaffId === staff.id && (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Right Panel: Detailed View */}
            <Card className="flex-1 flex flex-col h-full shadow-sm overflow-hidden border-none bg-transparent">
                {selectedStaff ? (
                    <div className="flex flex-col h-full gap-4">
                        {/* Profile Header Card */}
                        <div className="bg-card rounded-xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-center gap-5">
                                <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStaff.name}`} />
                                    <AvatarFallback className="text-xl">{selectedStaff.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
                                        <Badge variant={selectedStaff.active ? "default" : "secondary"}>
                                            {selectedStaff.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground font-medium flex items-center gap-2 mb-2">
                                        {selectedStaff.role}
                                        <span className="text-muted-foreground/30">•</span>
                                        <span className="text-sm">ID: {selectedStaff.id}</span>
                                    </p>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                                            <Mail className="h-3.5 w-3.5" />
                                            {selectedStaff.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                                            <Phone className="h-3.5 w-3.5" />
                                            {selectedStaff.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-6 pr-4 border-l pl-6 max-md:border-l-0 max-md:pl-0 max-md:pt-4 max-md:border-t">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{selectedStaff.routes.length}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assigned Routes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Orders</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{selectedStaff.stats.rating}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Routes Content */}
                        <Card className="flex-1 flex flex-col overflow-hidden border">
                            <CardHeader className="py-4 px-6 border-b bg-muted/5 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Assigned Routes</CardTitle>
                                    <CardDescription>Territories and areas covered by this staff member</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Search className="h-4 w-4" /> Search Routes
                                    </Button>
                                    <Button size="sm" className="gap-2">
                                        <MapPin className="h-4 w-4" /> Assign New Route
                                    </Button>
                                </div>
                            </CardHeader>
                            <ScrollArea className="flex-1 bg-muted/5 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {selectedStaff.routes.map((route) => (
                                        <div
                                            key={route.id}
                                            className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-all hover:border-primary/50 group"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                                        <MapPin className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm line-clamp-1" title={route.name}>{route.name}</h4>
                                                        <p className="text-xs text-muted-foreground">{route.id}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={route.status === "Active" ? "outline" : "secondary"} className="text-xs">
                                                    {route.status}
                                                </Badge>
                                            </div>

                                            <Separator className="my-3" />

                                            <div className="flex justify-between items-center text-sm">
                                                <div className="text-muted-foreground">
                                                    Current Load: <span className="font-medium text-foreground">{route.orders} Orders</span>
                                                </div>
                                                <Button variant="ghost" size="xs" className="h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Route Placeholder */}
                                    <button className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[120px]">
                                        <div className="bg-muted p-3 rounded-full mb-2 group-hover:bg-background">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium">Assign another route</span>
                                    </button>
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-card border rounded-xl">
                        <User className="h-16 w-16 opacity-20 mb-4" />
                        <h3 className="text-xl font-medium">No Staff Selected</h3>
                        <p className="max-w-xs text-center mt-2">Select a staff member from the directory to view detailed route assignments and performance stats.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default StaffRoute;
