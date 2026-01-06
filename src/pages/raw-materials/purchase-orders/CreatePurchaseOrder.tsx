import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const CreateRMPurchaseOrder = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Purchase Order created successfully!");
        navigate("/dashboard/raw-materials/purchase-orders");
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/raw-materials/purchase-orders">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Create Purchase Order</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="supplier">Select Supplier</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="s1">Textile Corp</SelectItem>
                                        <SelectItem value="s2">Thread Masters</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Order Date</Label>
                                <Input type="date" id="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="delivery">Expected Delivery</Label>
                                <Input type="date" id="delivery" />
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">Items</h3>
                                <Button variant="secondary" size="sm" type="button"><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
                            </div>

                            {/* Dummy Item Row */}
                            <div className="grid grid-cols-12 gap-3 items-end border p-3 rounded mb-2 bg-slate-50">
                                <div className="col-span-4 space-y-1">
                                    <Label className="text-xs">Raw Material</Label>
                                    <Select>
                                        <SelectTrigger h-9><SelectValue placeholder="Item" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="m1">Cotton Fabric</SelectItem>
                                            <SelectItem value="m2">Thread</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label className="text-xs">Quantity</Label>
                                    <Input type="number" placeholder="0" className="h-9" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label className="text-xs">Unit Cost</Label>
                                    <Input type="number" placeholder="0.00" className="h-9" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label className="text-xs">Total</Label>
                                    <Input type="number" placeholder="0.00" disabled className="h-9 bg-gray-100" />
                                </div>
                                <div className="col-span-1">
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 w-32">
                                <Save className="mr-2 h-4 w-4" /> Create PO
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateRMPurchaseOrder;
