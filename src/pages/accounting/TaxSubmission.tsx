"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Search, X, Plus, FileText, Download, CheckCircle, AlertCircle, Scale } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
    useGetTaxSubmissionsQuery,
    useAddTaxSubmissionMutation
} from "@/store/features/accounting/accoutntingApiService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { CreateTaxSubmissionInput } from "@/types/accounting.types";

export default function TaxSubmission() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("ALL");

    const { data: taxData, isLoading } = useGetTaxSubmissionsQuery({
        limit: 50, // Increase limit for dashboard view or implement infinite scroll/better pagination
        tax_type: filterType === "ALL" ? undefined : filterType,
    });

    const taxSubmissions = taxData?.data || [];
    const stats = taxData?.stats || { total_tax: 0, total_paid: 0, total_due: 0 };
    const [addTaxSubmission, { isLoading: isAdding }] = useAddTaxSubmissionMutation();

    const { control, handleSubmit, reset } = useForm<CreateTaxSubmissionInput>({
        defaultValues: {
            tax_type: "VAT",
            amount: 0,
            submission_date: format(new Date(), "yyyy-MM-dd"),
            period_start: format(new Date(), "yyyy-MM-01"),
            period_end: format(new Date(), "yyyy-MM-dd"),
            status: "SUBMITTED",
            notes: "",
        },
    });

    const onSubmit = async (data: CreateTaxSubmissionInput) => {
        try {
            await addTaxSubmission(data).unwrap();
            toast.success("Tax submission recorded successfully");
            setIsOpen(false);
            reset();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to record tax submission");
            console.error(error);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setFilterType("ALL");
    };

    return (
        <div className="space-y-6 p-6 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tax Submissions</h2>
                    <p className="text-muted-foreground">Monitor and record your tax filings and payments.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> New Submission
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Record Tax Submission</DialogTitle>
                            <DialogDescription>
                                Fill in the details of your tax filing. This will auto-post to accounting.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tax Type <span className="text-red-500">*</span></Label>
                                    <Controller
                                        name="tax_type"
                                        control={control}
                                        rules={{ required: "Tax type is required" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select tax type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="VAT">VAT</SelectItem>
                                                    <SelectItem value="GST">GST</SelectItem>
                                                    <SelectItem value="Income Tax">Income Tax</SelectItem>
                                                    <SelectItem value="Corporation Tax">Corporation Tax</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount <span className="text-red-500">*</span></Label>
                                    <Controller
                                        name="amount"
                                        control={control}
                                        rules={{ required: "Amount is required", min: 0 }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Period Start <span className="text-red-500">*</span></Label>
                                    <Controller
                                        name="period_start"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input {...field} type="date" />
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Period End <span className="text-red-500">*</span></Label>
                                    <Controller
                                        name="period_end"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input {...field} type="date" />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Submission Date <span className="text-red-500">*</span></Label>
                                    <Controller
                                        name="submission_date"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Input {...field} type="date" />
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reference Number</Label>
                                    <Controller
                                        name="reference_number"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="e.g. VAT/2026/01" />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea {...field} placeholder="Any additional information..." />
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOpen(false)} type="button">Cancel</Button>
                                <Button type="submit" className="bg-indigo-600 shadow-md" disabled={isAdding}>
                                    {isAdding ? "Recording..." : "Record Submission"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-l-4 border-l-indigo-600 shadow-sm bg-gradient-to-br from-white to-indigo-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tax Liability</CardTitle>
                        <Scale className="h-5 w-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${stats.total_tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Sum of all recorded tax filings</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-600 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tax Paid</CardTitle>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${stats.total_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Successfully processed tax payments</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-600 shadow-sm bg-gradient-to-br from-white to-orange-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tax Due</CardTitle>
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${stats.total_due.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Pending or unpaid tax filings</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card p-3 rounded-lg border shadow-sm px-4 gap-4">
                    <TabsList className="bg-muted h-10">
                        <TabsTrigger value="all" className="px-6 h-8">All Submissions</TabsTrigger>
                        <TabsTrigger value="paid" className="px-6 h-8 text-emerald-600 data-[state=active]:text-emerald-700">Tax Paid List</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 min-w-[200px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search reference..."
                                className="pl-8 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[160px] h-10">
                                <SelectValue placeholder="Tax Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Tax Types</SelectItem>
                                <SelectItem value="VAT">VAT</SelectItem>
                                <SelectItem value="GST">GST</SelectItem>
                                <SelectItem value="Income Tax">Income Tax</SelectItem>
                                <SelectItem value="Corporation Tax">Corporation Tax</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || filterType !== "ALL") && (
                            <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10 text-muted-foreground hover:text-red-500">
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>

                <TabsContent value="all" className="mt-0">
                    <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
                        <TableBase
                            submissions={taxSubmissions.filter(s => s.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery)}
                            isLoading={isLoading}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="paid" className="mt-0">
                    <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
                        <TableBase
                            submissions={taxSubmissions.filter(sub => (sub.status === 'PAID' || sub.status === 'SUBMITTED') && (sub.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery))}
                            isLoading={isLoading}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TableBase({ submissions, isLoading }: { submissions: any[], isLoading: boolean }) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "PAID": return "default";
            case "SUBMITTED": return "secondary";
            case "PENDING": return "outline";
            default: return "outline";
        }
    };

    return (
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                    <TableHead className="font-semibold">Submission Date</TableHead>
                    <TableHead className="font-semibold">Tax Type</TableHead>
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">Reference</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Amount</TableHead>
                    <TableHead className="text-center font-semibold">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell colSpan={7}><Skeleton className="h-12 w-full" /></TableCell>
                        </TableRow>
                    ))
                ) : submissions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-40 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileText className="h-10 w-10 mb-2 opacity-20" />
                                <p>No tax submissions found matching your criteria.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    submissions.map((sub) => (
                        <TableRow key={sub.id} className="hover:bg-muted/30 transition-colors group">
                            <TableCell className="font-medium">{sub.submission_date}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100">
                                        {sub.tax_type}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {sub.period_start} → {sub.period_end}
                            </TableCell>
                            <TableCell className="font-mono text-xs">{sub.reference_number || "—"}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(sub.status)} className="capitalize">
                                    {sub.status.toLowerCase()}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-indigo-600">
                                ${Number(sub.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="ghost" size="icon" title="Download Receipt" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
