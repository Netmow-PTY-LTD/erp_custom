import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetAllPayrollRunsQuery } from "@/store/features/payroll/payrollApiService";
import { useGetAllStaffsQuery } from "@/store/features/staffs/staffApiService";
import { useAppSelector } from "@/store/store";

export default function Payslips() {
    const [selectedRunId, setSelectedRunId] = useState<number | null>(null);

    const { data: payrollRunsData, isLoading: isPayrollLoading } = useGetAllPayrollRunsQuery();
    const { data: staffData } = useGetAllStaffsQuery({ limit: 1000 }); // Fetch all staff
    const currency = useAppSelector((state) => state.currency.value);

    const payrollRuns = payrollRunsData?.data || [];
    const staffs = staffData?.data || [];

    // --- Compute Available Payroll Runs (Months) ---
    const payrollRunOptions = useMemo(() => {
        return payrollRuns.map((run) => ({
            value: run.id,
            label: `${new Date(run.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })} - ${run.status.toUpperCase()}`,
            month: run.month,
        }));
    }, [payrollRuns]);

    // Set default selected run
    useEffect(() => {
        if (selectedRunId === null && payrollRunOptions.length > 0) {
            setSelectedRunId(payrollRunOptions[0].value);
        }
    }, [payrollRunOptions, selectedRunId]);

    // --- Prepare Payslip Data ---
    const payslipData = useMemo(() => {
        if (selectedRunId === null) return [];

        const selectedRun = payrollRuns.find((run) => run.id === selectedRunId);
        if (!selectedRun || !selectedRun.items) return [];

        return selectedRun.items.map((item) => {
            const staff = staffs.find((s) => Number(s.id) === Number(item.staff_id));
            return {
                id: item.id,
                empCode: staff?.id ? `EMP-${staff.id}` : `ID-${item.staff_id}`,
                employee: staff ? `${staff.first_name} ${staff.last_name}` : "Unknown Staff",
                gross: item.gross_pay,
                net: item.net_pay,
                status: selectedRun.status,
                email: staff?.email,
                runId: selectedRun.id,
                staffId: item.staff_id,
            };
        });
    }, [payrollRuns, staffs, selectedRunId]);



    const columns = [
        { accessorKey: "empCode", header: "Emp Code" },
        { accessorKey: "employee", header: "Employee" },
        {
            accessorKey: "net",
            header: `Net Salary (${currency})`,
            cell: ({ row }: any) => {
                const val = row.getValue("net");
                return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => { // Explicitly type row as any to avoid implicit any error
                const value = row.getValue("status");
                const color =
                    value === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700";
                return (
                    <span className={`px-2 py-1 text-xs rounded-full uppercase ${color}`}>{value}</span>
                );
            },
        },
        {
            accessorKey: "payslip",
            header: "Payslip",
            cell: () => (
                <Button size="sm" variant="outline">
                    PDF
                </Button>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }: any) => (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm" disabled={!row.original.email}>
                    Send
                </Button>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-6">
            <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
                <CardHeader className="flex justify-between items-center border-b-1 dark:border-gray-700 py-3 gap-0">
                    <CardTitle className="text-lg font-semibold">Payslips</CardTitle>
                    <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
                        Bulk Download PDF
                    </Button>
                </CardHeader>

                <CardContent className="pt-4 pb-6 space-y-4">
                    {/* Payroll Run Selector */}
                    <div className="max-w-xs">
                        <Select value={selectedRunId?.toString() || ""} onValueChange={(val) => setSelectedRunId(Number(val))} disabled={payrollRunOptions.length === 0}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={payrollRunOptions.length === 0 ? "No Payroll Data" : "Select Payroll Run"} />
                            </SelectTrigger>
                            <SelectContent>
                                {payrollRunOptions.map((run) => (
                                    <SelectItem key={run.value} value={run.value.toString()}>
                                        {run.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payslip Table */}
                    <DataTable columns={columns} data={payslipData} pageSize={10} isFetching={isPayrollLoading} />

                    <p className="text-xs text-gray-400 mt-2">
                        Payslips are generated from payroll records.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
