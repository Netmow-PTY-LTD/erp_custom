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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";

import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

const CreateProduction = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Production batch created successfully!");
        navigate("/dashboard/production/list");
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/production">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Create New Production</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Batch Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="product">Select Product</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a product..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="p1">Men's Cotton T-Shirt</SelectItem>
                                        <SelectItem value="p2">Slim Fit Jeans</SelectItem>
                                        <SelectItem value="p3">Hoodie XL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Target Quantity</Label>
                                <Input id="quantity" type="number" placeholder="100" min="1" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" type="date" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">Expected Completion</Label>
                                <Input id="end_date" type="date" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supervisor">Supervisor / Lead</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Assign a person..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="s1">Ali Hasan</SelectItem>
                                        <SelectItem value="s2">Rezaul Karim</SelectItem>
                                        <SelectItem value="s3">Sarah Khan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="line">Production Line (Optional)</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select line..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="line_a">Line A</SelectItem>
                                        <SelectItem value="line_b">Line B</SelectItem>
                                        <SelectItem value="line_c">Line C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes / Instructions</Label>
                            <Textarea id="notes" placeholder="Special instructions for this batch..." />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link to="/dashboard/production/list">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                                <Save className="w-4 h-4 mr-2" />
                                Create Batch
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateProduction;
