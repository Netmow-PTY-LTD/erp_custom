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
import { ArrowLeft, Save } from "lucide-react";

import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

const AddRawMaterial = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        toast.success("Raw material added successfully!");
        navigate("/dashboard/raw-materials");
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/raw-materials">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add Raw Material</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Material Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Material Name</Label>
                                <Input id="name" placeholder="e.g. Cotton Fabric" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fabric">Fabric</SelectItem>
                                        <SelectItem value="thread">Thread</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                        <SelectItem value="packaging">Packaging</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supplier">Supplier</Label>
                                <Input id="supplier" placeholder="Select supplier (Dummy Input)" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit of Measure</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="meters">Meters</SelectItem>
                                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                                        <SelectItem value="liters">Liters</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost Price (per unit)</Label>
                                <Input id="cost" type="number" placeholder="0.00" min="0" step="0.01" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Initial Stock</Label>
                                <Input id="stock" type="number" placeholder="0" min="0" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="min_stock">Reorder Point (Min Stock)</Label>
                                <Input id="min_stock" type="number" placeholder="10" min="0" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input id="description" placeholder="Additional details..." />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link to="/dashboard/raw-materials">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                                <Save className="w-4 h-4 mr-2" />
                                Save Material
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddRawMaterial;
