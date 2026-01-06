import React, { useState } from "react";
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
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const CreateBom = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([{ id: 1, material: "", qty: "" }]);

    const addItem = () => {
        setItems([...items, { id: items.length + 1, material: "", qty: "" }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("BOM Created Successfully!");
        navigate("/dashboard/production/bom");
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/production/bom">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Create New Recipe (BOM)</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product & Materials</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select Product</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Choose product..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="p1">Men's Cotton T-Shirt</SelectItem>
                                    <SelectItem value="p2">Denim Jeans</SelectItem>
                                    <SelectItem value="p3">Summer Dress</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">Raw Materials Required</h3>
                                <Button variant="secondary" size="sm" type="button" onClick={addItem}>
                                    <Plus className="w-4 h-4 mr-1" /> Add Material
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-3 items-end border p-3 rounded bg-slate-50">
                                        <div className="col-span-1 flex items-center justify-center h-full pb-2 font-medium text-gray-400">
                                            {index + 1}
                                        </div>
                                        <div className="col-span-6 space-y-1">
                                            <Label className="text-xs">Raw Material</Label>
                                            <Select>
                                                <SelectTrigger h-9><SelectValue placeholder="Select Material" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="m1">Cotton Fabric</SelectItem>
                                                    <SelectItem value="m2">Polyester Thread</SelectItem>
                                                    <SelectItem value="m3">Buttons</SelectItem>
                                                    <SelectItem value="m4">Zipper</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-4 space-y-1">
                                            <Label className="text-xs">Quantity Required (per unit)</Label>
                                            <div className="flex gap-2">
                                                <Input type="number" placeholder="0.00" className="h-9" />
                                                <span className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 rounded">Units</span>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <Button variant="ghost" size="icon" type="button" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 w-40">
                                <Save className="mr-2 h-4 w-4" /> Save BOM
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateBom;
