
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, UserPlus, Users, CheckCircle2, Package, MapPin, Phone, CreditCard, Clock, X } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const dummyStaff = [
    { id: "S001", name: "Alice Johnson", role: "Sales Rep" },
    { id: "S002", name: "Bob Smith", role: "Driver" },
    { id: "S003", name: "Charlie Brown", role: "Sales Rep" },
    { id: "S004", name: "David Wilson", role: "Driver" },
    { id: "S005", name: "Eve Davis", role: "Manager" },
];

// Updated initialOrders to support multiple staff (assignedTo is string[])
const initialOrders = [
    {
        id: "ORD-101",
        customer: "Tech Solutions",
        date: "2023-10-25",
        total: 1500,
        status: "Pending",
        assignedTo: [], // No staff
        items: [
            { name: "Wireless Mouse", qty: 10, price: 50 },
            { name: "Mechanical Keyboard", qty: 5, price: 200 }
        ],
        address: "123 Tech Park, Dhaka",
        contact: "+880 1711-000000"
    },
    {
        id: "ORD-102",
        customer: "Global Traders",
        date: "2023-10-24",
        total: 8500,
        status: "Shipped",
        assignedTo: ["S001", "S002"], // Alice & Bob
        items: [
            { name: "Gaming Monitor 27\"", qty: 20, price: 400 },
            { name: "HDMI Cable", qty: 50, price: 10 }
        ],
        address: "456 Export Zone, Chittagong",
        contact: "+880 1811-000000"
    },
    {
        id: "ORD-103",
        customer: "Local Mart",
        date: "2023-10-23",
        total: 420,
        status: "Delivered",
        assignedTo: ["S002"], // Bob only
        items: [
            { name: "USB Hub", qty: 15, price: 28 }
        ],
        address: "789 Local Bazar, Sylhet",
        contact: "+880 1911-000000"
    },
    {
        id: "ORD-104",
        customer: "Super Store",
        date: "2023-10-22",
        total: 2300,
        status: "Cancelled",
        assignedTo: [],
        items: [
            { name: "Webcam 1080p", qty: 10, price: 80 },
            { name: "Microphone", qty: 3, price: 500 }
        ],
        address: "321 Super Market, Rajshahi",
        contact: "+880 1611-000000"
    },
    {
        id: "ORD-105",
        customer: "Mega Corp",
        date: "2023-10-26",
        total: 12000,
        status: "Pending",
        assignedTo: ["S001", "S003", "S004"], // 3 Staff
        items: [
            { name: "Office Chair", qty: 10, price: 1000 },
            { name: "Desk Lamp", qty: 20, price: 100 }
        ],
        address: "654 Mega Tower, Gulshan",
        contact: "+880 1511-000000"
    },
];

const OrderManage = () => {
    // Type definition for order to handle string[] assignedTo
    type Order = typeof initialOrders[0] & { assignedTo: string[] };

    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    // Dialog State
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

    // View Details State
    const [viewOrder, setViewOrder] = useState<Order | null>(null);
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

    // Track which orders are being assigned
    const [ordersToAssign, setOrdersToAssign] = useState<string[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedOrders(orders.map((o) => o.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedOrders((prev) => [...prev, id]);
        } else {
            setSelectedOrders((prev) => prev.filter((orderId) => orderId !== id));
        }
    };

    const openAssignDialog = (orderIds: string[]) => {
        setOrdersToAssign(orderIds);

        // If single order, pre-select existing staff (optional but nice)
        if (orderIds.length === 1) {
            const order = orders.find(o => o.id === orderIds[0]);
            if (order) {
                setSelectedStaffIds(order.assignedTo);
            } else {
                setSelectedStaffIds([]);
            }
        } else {
            setSelectedStaffIds([]); // Reset for bulk assignment to avoid confusion
        }

        setIsAssignDialogOpen(true);
    };

    const toggleStaffSelection = (staffId: string) => {
        setSelectedStaffIds(prev =>
            prev.includes(staffId)
                ? prev.filter(id => id !== staffId)
                : [...prev, staffId]
        );
    };

    const handleAssignStaff = () => {
        // Even if empty, we might want to allow clearing assignments, so checking length > 0 might strictly be optional depending on requirement.
        // Assuming we allow clearing if user unchecks all.

        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                ordersToAssign.includes(order.id)
                    ? { ...order, assignedTo: selectedStaffIds }
                    : order
            )
        );

        toast.success(`Updated staff assignment for ${ordersToAssign.length} order(s)`);
        setIsAssignDialogOpen(false);
        setOrdersToAssign([]);
        setSelectedOrders([]); // Clear selection after bulk action

        // If view sheet matches modified order, update it? 
        // Logic: The sheet uses `viewOrder` which is a copy. We should close it or update it.
        // Simplest: If sheet is open and matches assign target, close it to refresh or manually update state.
        if (isViewSheetOpen && viewOrder && ordersToAssign.includes(viewOrder.id)) {
            // For simplicity, let's just close it or user can re-open. 
            // Better user experience: update local viewOrder
            setViewOrder(prev => prev ? { ...prev, assignedTo: selectedStaffIds } : null);
        }
    };

    const handleViewOrder = (order: Order) => {
        setViewOrder(order);
        setIsViewSheetOpen(true);
    };

    const getStaffDetails = (id: string) => {
        return dummyStaff.find((s) => s.id === id);
    };

    return (
        <div className="p-6 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-muted-foreground mt-1">Manage orders, view details, and assign staff.</p>
                </div>
                <div className="flex gap-2">
                    {selectedOrders.length > 0 && (
                        <Button
                            variant="secondary"
                            onClick={() => openAssignDialog(selectedOrders)}
                            className="animate-in fade-in slide-in-from-right-5"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Assign to {selectedOrders.length} Orders
                        </Button>
                    )}
                    <Button>Create New Order</Button>
                </div>
            </div>

            <div className="border rounded-md bg-card shadow-sm flex-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedOrders.length === orders.length && orders.length > 0}
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                            </TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned Staff</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className={selectedOrders.includes(order.id) ? "bg-muted/50" : ""}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedOrders.includes(order.id)}
                                        onCheckedChange={(checked) => handleSelectRow(order.id, checked as boolean)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            order.status === "Delivered" ? "default" :
                                                order.status === "Pending" ? "secondary" :
                                                    order.status === "Cancelled" ? "destructive" : "outline"
                                        }
                                        className={
                                            order.status === "Shipped" ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200" : ""
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {order.assignedTo.length > 0 ? (
                                        <div className="flex items-center -space-x-2 overflow-hidden hover:space-x-1 transition-all duration-300">
                                            {order.assignedTo.map((staffId, i) => {
                                                const staff = getStaffDetails(staffId);
                                                if (!staff) return null;
                                                return (
                                                    <Avatar key={staffId} className="h-8 w-8 border-2 border-background ring-1 ring-muted" title={staff.name}>
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                            {staff.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground italic">Unassigned</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-semibold">${order.total.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="View Details"
                                            onClick={() => handleViewOrder(order)}
                                        >
                                            <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Assign Staff"
                                            onClick={() => openAssignDialog([order.id])}
                                        >
                                            <UserPlus className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* View Order Sheet */}
            <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
                <SheetContent className="sm:max-w-xl">
                    <SheetHeader className="mb-6">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                                {viewOrder?.id}
                                <Badge variant={viewOrder?.status === "Delivered" ? "default" : "secondary"} className="ml-2 text-sm font-normal">
                                    {viewOrder?.status}
                                </Badge>
                            </SheetTitle>
                        </div>
                        <SheetDescription>
                            Order placed on {viewOrder?.date}
                        </SheetDescription>
                    </SheetHeader>

                    {viewOrder && (
                        <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
                            <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm text-muted-foreground uppercase flex items-center gap-2">
                                        <Users className="h-4 w-4" /> Customer Details
                                    </h3>
                                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Name:</span>
                                            <span className="text-sm">{viewOrder.customer}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Contact:</span>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Phone className="h-3 w-3" /> {viewOrder.contact}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Address:</span>
                                            <div className="flex items-center gap-1 text-sm text-right">
                                                <MapPin className="h-3 w-3" /> {viewOrder.address}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Staff Info (Multiple) */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-muted-foreground uppercase flex items-center gap-2">
                                            <UserPlus className="h-4 w-4" /> Assigned Staff ({viewOrder.assignedTo.length})
                                        </h3>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
                                            // Keep sheet open but open dialog
                                            openAssignDialog([viewOrder.id]);
                                        }}>
                                            Manage Assignment
                                        </Button>
                                    </div>

                                    {viewOrder.assignedTo.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-2">
                                            {viewOrder.assignedTo.map(staffId => {
                                                const staff = getStaffDetails(staffId);
                                                if (!staff) return null;
                                                return (
                                                    <div key={staffId} className="flex items-center gap-3 bg-card p-3 rounded-lg border shadow-sm">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                                                            <AvatarFallback>{staff.name.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{staff.name}</p>
                                                            <p className="text-xs text-muted-foreground">{staff.role}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                                            <span className="text-sm text-muted-foreground italic">No staff assigned yet.</span>
                                            <Button variant="outline" size="sm" onClick={() => {
                                                openAssignDialog([viewOrder.id]);
                                            }}>
                                                Assign Staff
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Items List */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm text-muted-foreground uppercase flex items-center gap-2">
                                        <Package className="h-4 w-4" /> Order Items
                                    </h3>
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="h-9">Item</TableHead>
                                                    <TableHead className="h-9 text-right">Qty</TableHead>
                                                    <TableHead className="h-9 text-right">Price</TableHead>
                                                    <TableHead className="h-9 text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {viewOrder.items.map((item, index) => (
                                                    <TableRow key={index} className="hover:bg-transparent">
                                                        <TableCell className="py-2">{item.name}</TableCell>
                                                        <TableCell className="text-right py-2">{item.qty}</TableCell>
                                                        <TableCell className="text-right py-2">${item.price}</TableCell>
                                                        <TableCell className="text-right py-2 font-medium">${item.price * item.qty}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow className="bg-muted/50 font-medium">
                                                    <TableCell colSpan={3} className="text-right">Grand Total</TableCell>
                                                    <TableCell className="text-right text-primary">${viewOrder.total.toLocaleString()}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                <Separator />

                                {/* Payment Info Mock */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm text-muted-foreground uppercase flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" /> Payment Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-muted/30 p-3 rounded-md">
                                            <span className="text-xs text-muted-foreground block text-left">Payment Method</span>
                                            <span className="text-sm font-medium">Cash on Delivery</span>
                                        </div>
                                        <div className="bg-muted/30 p-3 rounded-md">
                                            <span className="text-xs text-muted-foreground block text-left">Payment Status</span>
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Clock className="h-3 w-3" /> {viewOrder.status === 'Delivered' ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </SheetContent>
            </Sheet>

            {/* Assign Dialog - MULTI SELECT */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Staff</DialogTitle>
                        <DialogDescription>
                            Select one or more staff members to assign to {ordersToAssign.length} selected order(s).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <ScrollArea className="h-[200px] border rounded-md p-2">
                            <div className="space-y-1">
                                {dummyStaff.map((staff) => {
                                    const isSelected = selectedStaffIds.includes(staff.id);
                                    return (
                                        <div
                                            key={staff.id}
                                            className={`flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer ${isSelected ? 'bg-accent/50' : ''}`}
                                            onClick={() => toggleStaffSelection(staff.id)}
                                        >
                                            <Checkbox
                                                id={`staff-${staff.id}`}
                                                checked={isSelected}
                                                onCheckedChange={() => toggleStaffSelection(staff.id)}
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                                                    <AvatarFallback>{staff.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <label
                                                        htmlFor={`staff-${staff.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {staff.name}
                                                    </label>
                                                    <span className="text-xs text-muted-foreground">{staff.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                        <div className="mt-2 text-xs text-muted-foreground">
                            {selectedStaffIds.length} staff member{selectedStaffIds.length !== 1 ? 's' : ''} selected
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignStaff}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Confirm Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrderManage;
