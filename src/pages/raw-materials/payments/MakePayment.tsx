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
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const MakeSupplierPayment = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Payment recorded successfully!");
        navigate("/dashboard/raw-materials/payments");
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/raw-materials/payments">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Record Payment</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="invoice">Select Invoice</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Search Invoice..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inv1">INV-2024-001 (Textile Corp - $50,000)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Payment Date</Label>
                                <Input type="date" id="date" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount Paying</Label>
                                <Input type="number" id="amount" placeholder="0.00" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="method">Payment Method</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank">Bank Transfer</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes / Reference</Label>
                                <Textarea id="notes" placeholder="Transaction ID, Check No, etc." />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-green-600 hover:bg-green-500 w-full">
                                <CheckCircle className="mr-2 h-4 w-4" /> Confirm Payment
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MakeSupplierPayment;
