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
import { ArrowLeft, Calculator, Save } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const AddFinishedGood = () => {
    const navigate = useNavigate();
    const [cost, setCost] = useState("");
    const [margin, setMargin] = useState("30"); // default 30% margin
    const [salesPrice, setSalesPrice] = useState("");

    const handleCalculatePrice = () => {
        if (!cost) return;
        const costNum = parseFloat(cost);
        const marginNum = parseFloat(margin);
        const calculated = costNum + (costNum * (marginNum / 100));
        setSalesPrice(calculated.toFixed(2));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Stock Updated Successfully!");
        navigate("/dashboard/production/finished-goods");
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/production/finished-goods">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add Finished Goods to Stock</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Batch & Pricing Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Production Batch</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select Completed Batch..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="b1">B-205 (Men's Cotton T-Shirt) - 350 Qty</SelectItem>
                                        <SelectItem value="b2">B-206 (Denim Jeans) - 50 Qty</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Entry Date</Label>
                                <Input type="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Quantity Produced</Label>
                                <Input type="number" placeholder="Enter quantity" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Select Warehouse</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="w1">Main Warehouse</SelectItem>
                                        <SelectItem value="w2">Showroom Store</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator />
                        <h3 className="font-semibold text-lg">Pricing Configuration</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                                <Label>Unit Cost Price</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        type="number"
                                        className="pl-7"
                                        placeholder="0.00"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Margin (%)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={margin}
                                        onChange={(e) => setMargin(e.target.value)}
                                        placeholder="%"
                                    />
                                    <Button type="button" variant="secondary" onClick={handleCalculatePrice}>
                                        <Calculator className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Sales Price</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        type="number"
                                        className="pl-7 font-bold text-green-600"
                                        placeholder="0.00"
                                        value={salesPrice}
                                        onChange={(e) => setSalesPrice(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 w-48">
                                <Save className="mr-2 h-4 w-4" /> Update Stock
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddFinishedGood;
