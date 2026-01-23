import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetAllPayrollRunsQuery } from "@/store/features/payroll/payrollApiService";
import { useGetAllStaffsQuery } from "@/store/features/staffs/staffApiService";
import { useAppSelector } from "@/store/store";

export default function Payslips() {
    const [searchParams] = useSearchParams();
    const monthParam = searchParams.get("month");
    const staffIdParam = searchParams.get("staffId");

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

    // Set default selected run or select based on URL parameter
    useEffect(() => {
        if (payrollRunOptions.length === 0) return;

        // If month parameter exists, find and select that run
        if (monthParam) {
            const matchingRun = payrollRunOptions.find(run => run.month === monthParam);
            if (matchingRun) {
                setSelectedRunId(matchingRun.value);
                return;
            }
        }

        // Otherwise, select the first run if none is selected
        if (selectedRunId === null) {
            setSelectedRunId(payrollRunOptions[0].value);
        }
    }, [payrollRunOptions, selectedRunId, monthParam]);

    // --- Prepare Payslip Data ---
    const payslipData = useMemo(() => {
        if (selectedRunId === null) return [];

        const selectedRun = payrollRuns.find((run) => run.id === selectedRunId);
        if (!selectedRun || !selectedRun.items) return [];

        let items = selectedRun.items;

        // Filter by staffId if provided in URL params
        if (staffIdParam) {
            items = items.filter(item => Number(item.staff_id) === Number(staffIdParam));
        }

        return items.map((item) => {
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
    }, [payrollRuns, staffs, selectedRunId, staffIdParam]);



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

                    {/* Staff Filter Indicator */}
                    {staffIdParam && payslipData.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                            <span className="text-sm text-blue-700">
                                <strong>Filtered:</strong> Showing payslip for {payslipData[0].employee} only
                            </span>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="ml-auto text-blue-600 hover:text-blue-800"
                                onClick={() => window.location.href = '/dashboard/payroll/payslips'}
                            >
                                Clear Filter
                            </Button>
                        </div>
                    )}

                    {/* No Data Found - Empty State */}
                    {staffIdParam && payslipData.length === 0 && !isPayrollLoading && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-900 mb-1">No Payslip Found</h3>
                                    <p className="text-sm text-amber-700 mb-4">
                                        {monthParam ? (
                                            <>Payroll has not been processed for <strong>{new Date(monthParam + "-01").toLocaleString("default", { month: "long", year: "numeric" })}</strong> yet.</>
                                        ) : (
                                            <>No payroll data found for this staff member.</>
                                        )}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = '/dashboard/payroll/payslips'}
                                    >
                                        View All Payslips
                                    </Button>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => window.location.href = '/dashboard/payroll'}
                                    >
                                        Go to Payroll Overview
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payslip Table */}
                    {(!staffIdParam || payslipData.length > 0) && (
                        <DataTable columns={columns} data={payslipData} pageSize={10} isFetching={isPayrollLoading} />
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                        Payslips are generated from payroll records.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
