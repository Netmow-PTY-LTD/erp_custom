import { DataTable } from "@/components/dashboard/components/DataTable";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    useDeleteStaffMutation,
    useGetAllStaffsQuery,
    useUpdatePayrollStructureMutation,
    useGetStaffByIdQuery,
    useGetPayrollStructureQuery,
} from "@/store/features/staffs/staffApiService";



import type { Department } from "@/types/types";
import type { Staff } from "@/types/staff.types";
import type { Role } from "@/types/users.types";
import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Banknote,
    Building2,
    CalendarCheck,
    CalendarX2,
    Clock,
    PieChart,
    PlusCircle,
    Trash,
    Users,
    Wallet,
    XCircle,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";


// Simple modal
function ConfirmModal({
    open,
    onClose,
    onConfirm,
    message,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl w-96">
                <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}





export default function HrPayrollOverview() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit] = useState(10);

    const navigate = useNavigate();

    const { data: staffsData, isLoading } = useGetAllStaffsQuery({
        page,
        limit,
        search,
    });
    const staffsList = staffsData?.data as Staff[] | [];
    const [deleteStaff] = useDeleteStaffMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    // -----------------------------------------
    //  DYNAMIC STATS BASED ON API RESPONSE
    // -----------------------------------------
    const totalStaff = staffsList?.length;

    const activeStaff = staffsList?.filter(
        (s: Staff) => s.status.toLowerCase() === "active"
    ).length;

    const inactiveStaff = staffsList?.filter(
        (s: Staff) => s.status.toLowerCase() === "inactive"
    ).length;

    const onLeaveStaff = staffsList?.filter(
        (s) => s.status.toLowerCase() === "on leave"
    ).length;

    const stats = [
        {
            label: "Total Staffs",
            value: totalStaff,
            gradient: "from-blue-600 to-blue-400",
            shadow: "shadow-blue-500/30",
            icon: <Users className="w-6 h-6 text-white" />,
        },
        {
            label: "Active Staffs",
            value: activeStaff,
            gradient: "from-emerald-600 to-emerald-400",
            shadow: "shadow-emerald-500/30",
            icon: <Clock className="w-6 h-6 text-white" />,
        },
        {
            label: "On Leave",
            value: onLeaveStaff,
            gradient: "from-amber-600 to-amber-400",
            shadow: "shadow-amber-500/30",
            icon: <CalendarX2 className="w-6 h-6 text-white" />,
        },
        {
            label: "Inactive Staffs",
            value: inactiveStaff,
            gradient: "from-rose-600 to-rose-400",
            shadow: "shadow-rose-500/30",
            icon: <XCircle className="w-6 h-6 text-white" />,
        },
    ];

    // -----------------------
    // DELETE HANDLER
    // -----------------------
    const handleDeleteClick = (staff: Staff) => {
        setSelectedStaff(staff);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedStaff) return;
        try {
            await deleteStaff(selectedStaff.id).unwrap();
            toast.success("Staff deleted successfully!");
            setModalOpen(false);
            setSelectedStaff(null);
        } catch (err) {
            toast.error("Failed to delete staff.");
            console.error(err);
        }
    };


    const handleAttendanceClick = (staff: Staff) => {
        navigate(`/dashboard/payroll/${staff.id}/payroll-run`);
    };


    // -----------------------
    // SALARY MANAGE HANDLER
    // -----------------------

    const [salaryModalOpen, setSalaryModalOpen] = useState(false);
    const [editingSalaryStaff, setEditingSalaryStaff] = useState<Staff | null>(null);
    const [updatePayrollStructure, { isLoading: isUpdating }] = useUpdatePayrollStructureMutation();

    // Fetch single staff details to ensure we have the latest salary structure
    const { data: staffDetails, isFetching: isFetchingDetails } = useGetStaffByIdQuery(editingSalaryStaff?.id as number, {
        skip: !editingSalaryStaff?.id,
    });

    const { data: payrollData, isFetching: isFetchingPayroll } = useGetPayrollStructureQuery(editingSalaryStaff?.id as number, {
        skip: !editingSalaryStaff?.id,
    });

    // Salary Form State
    const [salaryForm, setSalaryForm] = useState({
        basic_salary: 0,
        bank_name: "",
        account_name: "",
        account_number: "",
        allowances: [] as { name: string; amount: number }[],
        deductions: [] as { name: string; amount: number }[],
    });

    // Update form when detailed data is fetched
    useEffect(() => {
        if (payrollData?.data) {
            const payroll = payrollData.data;
            setSalaryForm({
                basic_salary: Number(payroll.basic_salary) || 0,
                bank_name: payroll.bank_details?.bank_name || "",
                account_name: payroll.bank_details?.account_name || "",
                account_number: payroll.bank_details?.account_number || "",
                allowances: payroll.allowances || [],
                deductions: payroll.deductions || [],
            });
        } else if (staffDetails?.data) {
            const staff = staffDetails.data;
            setSalaryForm({
                basic_salary: staff.basic_salary || staff.salary || 0,
                bank_name: staff.bank_details?.bank_name || "",
                account_name: staff.bank_details?.account_name || "",
                account_number: staff.bank_details?.account_number || "",
                allowances: staff.allowances || [],
                deductions: staff.deductions || [],
            });
        }
    }, [staffDetails, payrollData]);

    const handleSalaryClick = (staff: Staff) => {
        setEditingSalaryStaff(staff);
        setSalaryForm({
            basic_salary: staff.basic_salary || 0,
            bank_name: staff.bank_details?.bank_name || "",
            account_name: staff.bank_details?.account_name || "",
            account_number: staff.bank_details?.account_number || "",
            allowances: staff.allowances || [],
            deductions: staff.deductions || [],
        });
        setSalaryModalOpen(true);
    };

    // -----------------------
    // -----------------------
    // ADVANCE MANAGE HANDLER
    // -----------------------
    const handleAdvanceClick = (staff: Staff) => {
        navigate(`/dashboard/payroll/${staff.id}/advance`);
    };


    const addAllowance = () => {
        setSalaryForm(prev => ({
            ...prev,
            allowances: [...prev.allowances, { name: "", amount: 0 }]
        }));
    };

    const removeAllowance = (index: number) => {
        setSalaryForm(prev => ({
            ...prev,
            allowances: prev.allowances.filter((_, i) => i !== index)
        }));
    };

    const updateAllowance = (index: number, field: "name" | "amount", value: string | number) => {
        setSalaryForm(prev => {
            const newAllowances = [...prev.allowances];
            newAllowances[index] = { ...newAllowances[index], [field]: value };
            return { ...prev, allowances: newAllowances };
        });
    };

    const addDeduction = () => {
        setSalaryForm(prev => ({
            ...prev,
            deductions: [...prev.deductions, { name: "", amount: 0 }]
        }));
    };

    const removeDeduction = (index: number) => {
        setSalaryForm(prev => ({
            ...prev,
            deductions: prev.deductions.filter((_, i) => i !== index)
        }));
    };

    const updateDeduction = (index: number, field: "name" | "amount", value: string | number) => {
        setSalaryForm(prev => {
            const newDeductions = [...prev.deductions];
            newDeductions[index] = { ...newDeductions[index], [field]: value };
            return { ...prev, deductions: newDeductions };
        });
    };

    const saveSalaryDetails = async () => {
        if (!editingSalaryStaff) return;
        try {
            // Ensure strictly cleaner payload
            const formattedAllowances = salaryForm.allowances.map(a => ({
                name: a.name,
                amount: Number(a.amount)
            }));

            const formattedDeductions = salaryForm.deductions.map(d => ({
                name: d.name,
                amount: Number(d.amount)
            }));

            await updatePayrollStructure({
                id: editingSalaryStaff.id,
                body: {
                    basic_salary: Number(salaryForm.basic_salary),
                    allowances: formattedAllowances,
                    deductions: formattedDeductions,
                    bank_details: {
                        bank_name: salaryForm.bank_name,
                        account_name: salaryForm.account_name,
                        account_number: salaryForm.account_number,
                    }
                }
            }).unwrap();
            toast.success("Salary details updated!");
            setSalaryModalOpen(false);
            setEditingSalaryStaff(null);
        } catch (err) {
            toast.error("Failed to update salary details.");
            console.error(err);
        }
    };

    // Calculations for Summary
    const totalAllowances = salaryForm.allowances.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalDeductions = salaryForm.deductions.reduce((sum, item) => sum + Number(item.amount), 0);
    const grossSalary = salaryForm.basic_salary + totalAllowances;
    const netSalary = grossSalary - totalDeductions;

    // -----------------------
    // PAYROLL AGGREGATION
    // -----------------------
    const payrollAggregates = useMemo(() => {
        if (!staffsList) return null;

        let basic = 0;
        let totalAllowances = 0;
        let totalDeductions = 0;
        const allowanceBreakdown: Record<string, number> = {};
        const deductionBreakdown: Record<string, number> = {};

        staffsList.forEach((staff) => {
            // Extract payroll data from payrollStructure or fallback to staff object
            const payroll = staff.payrollStructure || staff;
            const salary = Number(payroll.basic_salary) || Number(staff.salary) || 0;
            basic += salary;

            const allowances = payroll.allowances || [];
            allowances.forEach((a: any) => {
                const amt = Number(a.amount) || 0;
                totalAllowances += amt;
                allowanceBreakdown[a.name] = (allowanceBreakdown[a.name] || 0) + amt;
            });

            const deductions = payroll.deductions || [];
            deductions.forEach((d: any) => {
                const amt = Number(d.amount) || 0;
                totalDeductions += amt;
                deductionBreakdown[d.name] = (deductionBreakdown[d.name] || 0) + amt;
            });
        });

        return {
            basic,
            totalAllowances,
            totalDeductions,
            net: basic + totalAllowances - totalDeductions,
            allowanceBreakdown,
            deductionBreakdown,
        };
    }, [staffsList]);


    const staffColumns: ColumnDef<Staff>[] = [
        {
            accessorKey: "id",
            header: "Employee ID #",
            meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[140px]" } as any,
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue("id")}</span>
            ),
        },

        {
            accessorKey: "first_name",
            header: "Name",
            meta: { className: "md:sticky md:left-[140px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
            cell: ({ row }) => (
                <div className="font-semibold">
                    {row.original?.first_name} {row.original?.last_name}
                </div>
            ),
        },
        {
            accessorKey: "thumb_url",
            header: "Image",
            cell: ({ row }) => {
                const image = row.getValue("thumb_url") as string;
                return (
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={image} />
                        </Avatar>
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "salary",
            header: "Basic Salary",
            cell: ({ row }) => {
                const salary = row.original.basic_salary || row.original.salary || 0;
                return <span className="font-medium">{salary.toLocaleString()}</span>
            }
        },
        {
            accessorKey: "total_advance",
            header: "Advance",
            cell: ({ row }) => {
                const amount = Number(row.original.total_advance || 0);
                return <span className="font-semibold text-rose-600">{amount > 0 ? amount.toLocaleString() : "-"}</span>
            }
        },
        {
            accessorKey: "total_returned",
            header: "Returned",
            cell: ({ row }) => {
                const amount = Number(row.original.total_returned || 0);
                return <span className="font-semibold text-emerald-600">{amount > 0 ? amount.toLocaleString() : "-"}</span>
            }
        },

        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => {
                const department = row.getValue("department") as Department | null;
                return <div className="font-normal">{department?.name}</div>;
            },
        },

        {
            accessorKey: "position",
            header: "Position",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as Role | null;
                return <div className="font-normal">{role?.display_name}</div>;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const color =
                    status.toLowerCase() === "active"
                        ? "bg-green-600"
                        : status.toLowerCase() === "inactive"
                            ? "bg-red-500"
                            : "bg-gray-500";
                return <Badge className={`${color} text-white capitalize`}>{status}</Badge>;
            },
        },

        {
            accessorKey: "created_at",
            header: "Hire Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at") as string);
                return date.toLocaleDateString();
            },
        },

        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleSalaryClick(item)}
                        >
                            <Wallet className="w-4 h-4 mr-1" /> Salary
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                            onClick={() => handleAttendanceClick(item)}
                        >
                            <CalendarCheck className="w-4 h-4 mr-1" /> Payroll Run
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200"
                            onClick={() => handleAdvanceClick(item)}
                        >
                            <ArrowUpCircle className="w-4 h-4 mr-1" /> Advance
                        </Button>
                        <Link to={`/dashboard/staffs/${item.id}`}>
                            <Button size="sm" variant="outline-info">
                                View
                            </Button>
                        </Link>
                        <Link to={`/dashboard/staffs/${item.id}/edit`}>
                            <Button size="sm" variant="outline">
                                Edit
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(item)}
                        >
                            <Trash className="w-4 h-4 mr-1" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Employee & Payroll Overview</h1>

                <Link to="/dashboard/staffs/add">
                    <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none">
                        <PlusCircle size={18} />
                        Add Employee
                    </button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {stats.map((item, idx) => (
                    <div
                        key={idx}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]`}
                    >
                        {/* Background Pattern */}
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/90">{item.label}</p>
                                <h3 className="mt-2 text-3xl font-bold text-white">
                                    {item.value || 0}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                                {item.icon}
                            </div>
                        </div>

                        {/* Progress/Indicator line */}
                        <div className="mt-4 h-1 w-full rounded-full bg-black/10">
                            <div className="h-full w-2/3 rounded-full bg-white/40" />
                        </div>
                    </div>
                ))}
            </div>

            <Card className="pt-6 pb-2">
                <CardHeader>
                    <CardTitle>All Employees</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <DataTable
                            columns={staffColumns}
                            data={staffsList ?? []}
                            pageIndex={page - 1}
                            pageSize={limit}
                            totalCount={staffsData?.pagination?.total}
                            onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
                            onSearch={(value) => {
                                setSearch(value);
                                setPage(1);
                            }}
                            isFetching={isLoading}
                        />
                    )}
                </CardContent>
            </Card>

            {/* PAYROLL FINANCIAL SUMMARY */}
            {staffsList && staffsList.length > 0 && (
                <div className="mt-8 space-y-6">
                    <div className="flex items-center gap-2">
                        <Banknote className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-bold tracking-tight text-gray-800">Monthly Payroll Estimation (Current View)</h2>
                    </div>

                    {/* 4 Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-medium text-gray-500">Total Basic Salary</p>
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {payrollAggregates?.basic.toLocaleString()}
                                </h3>
                                <p className="text-xs text-blue-500 mt-1 font-medium">Fixed Component</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-medium text-gray-500">Total Allowances</p>
                                    <div className="p-2 bg-emerald-100 rounded-full">
                                        <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {payrollAggregates?.totalAllowances.toLocaleString()}
                                </h3>
                                <p className="text-xs text-emerald-500 mt-1 font-medium">+ Additions</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-medium text-gray-500">Total Deductions</p>
                                    <div className="p-2 bg-rose-100 rounded-full">
                                        <ArrowDownCircle className="w-4 h-4 text-rose-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {payrollAggregates?.totalDeductions.toLocaleString()}
                                </h3>
                                <p className="text-xs text-rose-500 mt-1 font-medium">- Subtractions</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-600 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-purple-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-medium text-gray-500">Est. Net Payable</p>
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <Wallet className="w-4 h-4 text-purple-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-purple-700">
                                    {payrollAggregates?.net.toLocaleString()}
                                </h3>
                                <p className="text-xs text-purple-500 mt-1 font-medium">= Final Payout</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Breakdown Charts/Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Allowances Breakdown */}
                        <Card>
                            <CardHeader className="py-4 border-b-1 gap-0">
                                <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                                    <PieChart className="w-5 h-5" /> Allowance Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="space-y-3">
                                    {Object.entries(payrollAggregates?.allowanceBreakdown || {}).map(([name, amount], idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 font-medium">{name || "Other"}</span>
                                            <span className="font-bold text-emerald-600">{Number(amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {Object.keys(payrollAggregates?.allowanceBreakdown || {}).length === 0 && (
                                        <p className="text-sm text-gray-400 italic text-center py-4">No specific allowances defined.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deductions Breakdown */}
                        <Card>
                            <CardHeader className="py-4 border-b-1 gap-0">
                                <CardTitle className="text-lg flex items-center gap-2 text-rose-800">
                                    <PieChart className="w-5 h-5" /> Deduction Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="space-y-3">
                                    {Object.entries(payrollAggregates?.deductionBreakdown || {}).map(([name, amount], idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 font-medium">{name || "Other"}</span>
                                            <span className="font-bold text-rose-600">{Number(amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {Object.keys(payrollAggregates?.deductionBreakdown || {}).length === 0 && (
                                        <p className="text-sm text-gray-400 italic text-center py-4">No specific deductions defined.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* CONFIRM MODAL */}
            <ConfirmModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete ${selectedStaff?.first_name} ${selectedStaff?.last_name}?`}
            />


            {/* SALARY SETUP MODAL */}
            <Dialog open={salaryModalOpen} onOpenChange={setSalaryModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Payroll Setup: {editingSalaryStaff?.first_name}</DialogTitle>
                        <DialogDescription>
                            Configure basic salary, allowances, deductions and bank details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {(isFetchingDetails || isFetchingPayroll) && (
                            <div className="col-span-2 text-center py-10">
                                <p className="text-gray-500">Loading latest staff details...</p>
                            </div>
                        )}
                        {!isFetchingDetails && !isFetchingPayroll && (
                            <>
                                {/* Left Column: Basic & Bank */}
                                <div className="space-y-6">
                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <h4 className="font-semibold mb-4 text-purple-700 flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Employee Information
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-gray-500">Full Name</span>
                                                <span className="font-medium text-gray-900">{editingSalaryStaff?.first_name} {editingSalaryStaff?.last_name}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-gray-500">Email</span>
                                                <span className="font-medium text-gray-900">{editingSalaryStaff?.email}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-gray-500">Phone</span>
                                                <span className="font-medium text-gray-900">{editingSalaryStaff?.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-gray-500">Department</span>
                                                <span className="font-medium text-gray-900">{editingSalaryStaff?.department?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Role</span>
                                                <span className="font-medium text-gray-900">{editingSalaryStaff?.role?.display_name || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <h4 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                                            <Wallet className="w-4 h-4" /> Basic Info
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="salary" className="text-right">Basic Salary</Label>
                                                <Input
                                                    id="salary"
                                                    type="number"
                                                    value={salaryForm.basic_salary}
                                                    onChange={(e) => setSalaryForm({ ...salaryForm, basic_salary: Number(e.target.value) })}
                                                    className="col-span-2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <h4 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Bank Details
                                        </h4>
                                        <div className="space-y-3">
                                            <Input
                                                placeholder="Bank Name"
                                                value={salaryForm.bank_name}
                                                onChange={(e) => setSalaryForm({ ...salaryForm, bank_name: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Account Name"
                                                value={salaryForm.account_name}
                                                onChange={(e) => setSalaryForm({ ...salaryForm, account_name: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Account Number"
                                                value={salaryForm.account_number}
                                                onChange={(e) => setSalaryForm({ ...salaryForm, account_number: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Summary Card */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold mb-2 text-blue-800">Monthly Calculation Ref</h4>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Basic Salary:</span>
                                            <span>{salaryForm.basic_salary.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1 text-green-600">
                                            <span>+ Allowances:</span>
                                            <span>{totalAllowances.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2 text-red-600">
                                            <span>- Deductions:</span>
                                            <span>{totalDeductions.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                            <span>Net Salary:</span>
                                            <span>{netSalary.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Allowances & Deductions */}
                                <div className="space-y-6">

                                    {/* Allowances */}
                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold text-green-700">Allowances</h4>
                                            <Button size="sm" variant="outline" onClick={addAllowance} className="h-7">
                                                <PlusCircle className="w-3 h-3 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                            {salaryForm.allowances.map((item, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <Input
                                                        placeholder="Name (e.g. Transport)"
                                                        value={item.name}
                                                        onChange={(e) => updateAllowance(index, 'name', e.target.value)}
                                                        className="h-8 text-xs"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Amount"
                                                        value={item.amount}
                                                        onChange={(e) => updateAllowance(index, 'amount', Number(e.target.value))}
                                                        className="w-24 h-8 text-xs"
                                                    />
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => removeAllowance(index)}>
                                                        <Trash className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {salaryForm.allowances.length === 0 && <p className="text-xs text-gray-400 italic">No allowances added.</p>}
                                        </div>
                                    </div>

                                    {/* Deductions */}
                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold text-red-700">Deductions</h4>
                                            <Button size="sm" variant="outline" onClick={addDeduction} className="h-7">
                                                <PlusCircle className="w-3 h-3 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                            {salaryForm.deductions.map((item, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <Input
                                                        placeholder="Name (e.g. EPF)"
                                                        value={item.name}
                                                        onChange={(e) => updateDeduction(index, 'name', e.target.value)}
                                                        className="h-8 text-xs"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Amount"
                                                        value={item.amount}
                                                        onChange={(e) => updateDeduction(index, 'amount', Number(e.target.value))}
                                                        className="w-24 h-8 text-xs"
                                                    />
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => removeDeduction(index)}>
                                                        <Trash className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {salaryForm.deductions.length === 0 && <p className="text-xs text-gray-400 italic">No deductions added.</p>}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" onClick={saveSalaryDetails} disabled={isUpdating} className="w-full sm:w-auto">
                            {isUpdating ? "Saving..." : "Save Salary Details"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
}
