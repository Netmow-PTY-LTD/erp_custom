/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  UserPlus,
  PackagePlus,
  MapPin,
  Trash2,
  User,
  MoreHorizontal,
  Edit,
  Eye,
  ShoppingCart,
  Filter,
  AlertCircle,
  Printer,
  Car
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router";
import {
  useDeleteCustomerMutation,
  useGetCustomerStatsQuery,
  useGetActiveCustomersQuery,
} from "@/store/features/customers/customersApi";
import type { Customer } from "@/store/features/customers/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppSelector } from "@/store/store";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { CustomerPermission, SuperAdminPermission } from "@/config/permissions";

import { MapEmbed } from "@/components/MapEmbed";

export default function Customers() {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [mapLocation, setMapLocation] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("newest");
  const [previewData, setPreviewData] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const pageSize = 10;
  const currentPage = pageIndex + 1;

  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);

  // permissions

  const canDeleteCustomer = userPermissions.includes(CustomerPermission.DELETE) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);


  const currency = useAppSelector((state) => state.currency.value);

  // Fetch customers with pagination and search
  const { data, isLoading, error } = useGetActiveCustomersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    sort: sort !== 'newest' ? sort : undefined
  });

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCustomer(deleteId).unwrap();
      toast.success("Customer deleted successfully");
      setDeleteId(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to delete customer");
    }
  };

  const customers = data?.data || [];
  // const totalPages = data?.pagination.totalPage || 1;
  const totalCustomers = data?.pagination.total || 0;

  // Calculate stats from customers

  const { data: customerStats } = useGetCustomerStatsQuery(undefined);

  const activeCustomers = customerStats?.data?.find((c: any) => c.label === "All Active Customers")?.value || 0;
  const totalCustomersStat = customerStats?.data?.find((c: any) => c.label === "Total Customers")?.value || 0;
  const newCustomers = customerStats?.data?.find((c: any) => c.label === "New Customers")?.value || 0;
  const inactiveCustomers = customerStats?.data?.find((c: any) => c.label === "Inactive Customers")?.value || 0;
  const totalSales = customerStats?.data?.find((c: any) => c.label === "Total Sales Amount")?.value || 0;
  const totalPaid = customerStats?.data?.find((c: any) => c.label === "Total Paid")?.value || 0;
  const totalDue = customerStats?.data?.find((c: any) => c.label === "Total Due")?.value || 0;

  const stats = [
    {
      label: "Active Customers",
      value: activeCustomers,
      gradient: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-500/30",
      icon: <UserCheck className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Customers",
      value: totalCustomersStat,
      gradient: "from-blue-600 to-blue-400",
      shadow: "shadow-blue-500/30",
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      label: "New Customers",
      value: newCustomers,
      gradient: "from-violet-600 to-violet-400",
      shadow: "shadow-violet-500/30",
      icon: <UserPlus className="w-6 h-6 text-white" />,
    },
    {
      label: "Inactive Customers",
      value: inactiveCustomers,
      gradient: "from-rose-600 to-rose-400",
      shadow: "shadow-rose-500/30",
      icon: <UserX className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Sales Amount",
      value: `${currency} ${Number(totalSales).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: "from-indigo-600 to-indigo-400",
      shadow: "shadow-indigo-500/30",
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Paid",
      value: `${currency} ${Number(totalPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-500/30",
      icon: <DollarSign className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Due",
      value: `${currency} ${Number(totalDue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: "from-rose-600 to-rose-400",
      shadow: "shadow-rose-500/30",
      icon: <AlertCircle className="w-6 h-6 text-white" />,
    },
  ];


  const customerColumns: ColumnDef<Customer>[] = [
    {
      accessorKey: "id",
      header: "ID",
      meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[60px]" } as any
    },
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "md:sticky md:left-[60px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {row.original.company || "—"}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {row.original.name}
          </span>
        </div>
      )
    },
    {
      accessorKey: "thumb_url",
      header: "Image",
      meta: { className: "min-w-[110px]" } as any,
      cell: ({ row }) => {
        const thumbUrl = row.getValue("thumb_url") as string;
        // const galleryItems = row.original.gallery_items || [];
        return thumbUrl ? (
          <img
            src={thumbUrl}
            alt="Customer"
            className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            onClick={() =>
              setPreviewData({
                images: [thumbUrl].filter(Boolean),
                index: 0,
              })
            }
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-gray-500" />
          </div>
        );
      },
    },
    // {
    //   accessorKey: "gallery_items",
    //   header: "Gallery",
    //   cell: ({ row }) => {
    //     const gallery = row.original.gallery_items || [];
    //     // const thumbUrl = row.original.thumb_url;

    //     return (
    //       <div className="flex items-center gap-1">
    //         {gallery.length > 0 ? (
    //           <div className="flex -space-x-2 overflow-hidden hover:space-x-1 transition-all duration-300 p-1">
    //             {gallery.slice(0, 3).map((url, i) => (
    //               <img
    //                 key={i}
    //                 src={url}
    //                 alt={`Gallery ${i}`}
    //                 className="w-8 h-8 rounded-full border-2 border-background object-cover cursor-pointer hover:scale-110 transition-transform"
    //                 onClick={() =>
    //                   setPreviewData({
    //                     images: gallery,
    //                     index: i,
    //                   })
    //                 }
    //               />
    //             ))}
    //             {gallery.length > 3 && (
    //               <div
    //                 className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium cursor-pointer"
    //                 onClick={() =>
    //                   setPreviewData({
    //                     images: gallery,
    //                     index: 3,
    //                   })
    //                 }
    //               >
    //                 +{gallery.length - 3}
    //               </div>
    //             )}
    //           </div>
    //         ) : (
    //           <span className="text-xs text-muted-foreground">-</span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "customer_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("customer_type") as string;
        return type === "business" ? "Business" : "Individual";
      },
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="max-w-[200px] whitespace-normal break-words">
            {customer.address || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "credit_limit",
      header: () => (
        <div className="text-right">Credit Limit ({currency})</div>
      ),
      cell: ({ row }) => {
        const limit = row.getValue("credit_limit") as number;
        return (
          <div className="text-right">
            {limit ? Number(limit).toFixed(2) : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "total_sales",
      header: () => (
        <div className="text-right">Total Sales Amount ({currency})</div>
      ),
      cell: ({ row }) => {
        const amount = row.getValue("total_sales") as number;
        return (
          <div className="text-right font-medium">
            {amount ? Number(amount).toFixed(2) : "0.00"}
          </div>
        );
      },
    },
    {
      id: "paid_amount",
      header: () => (
        <div className="text-right">Total Paid ({currency})</div>
      ),
      cell: ({ row }) => {
        const total = (row.original.total_sales || 0) as number;
        const balance = (row.original.outstanding_balance || 0) as number;
        const paid = total - balance;
        return (
          <div className="text-right text-emerald-600 font-medium">
            {paid ? Number(paid).toFixed(2) : "0.00"}
          </div>
        );
      },
    },
    {
      accessorKey: "outstanding_balance",
      header: () => <div className="text-right">Total Due ({currency})</div>,
      cell: ({ row }) => {
        const balance = row.getValue("outstanding_balance") as number;
        return (
          <div className="text-right text-rose-600 font-bold">
            {balance ? Number(balance).toFixed(2) : "0.00"}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        const variant = isActive ? "success" : "destructive";
        return (
          <Badge variant={variant} className="text-white">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const { latitude, longitude, address, city, state, country } = row.original;
        const hasLocation = (latitude && longitude) || address;

        const handleMapClick = () => {
          let query = "";
          if (latitude && longitude) {
            query = `${latitude},${longitude}`;
          } else {
            query = [address, city, state, country].filter(Boolean).join(", ");
          }
          if (query) setMapLocation(query);
        };

        const handleWazeClick = () => {
          let url = "";
          if (latitude && longitude) {
            url = `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
          } else {
            const query = [address, city, state, country].filter(Boolean).join(", ");
            url = `https://www.waze.com/ul?q=${encodeURIComponent(query)}`;
          }
          window.open(url, "_blank");
        };

        if (!hasLocation) return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex items-center gap-1 print:hidden">
            <Button variant="ghost" size="icon" onClick={handleMapClick} title="View Map">
              <MapPin className="h-4 w-4 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleWazeClick} title="Open in Waze">
              <Car className="h-4 w-4 text-orange-500" />
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/sales/orders/create?customerId=${id}`} className="flex items-center cursor-pointer">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Create Sales Order
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/customers/${id}/edit`} className="flex items-center cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/customers/${id}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              {canDeleteCustomer && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteId(id)}
                    className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="text-red-600">
          Error loading customers. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 print:hidden">
        <h2 className="text-3xl font-semibold">All Active Customers</h2>

        <div className="flex flex-wrap items-center gap-4 ">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-slate-600 to-slate-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-slate-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-slate-500/40 active:translate-y-0 active:shadow-none print:hidden">
            <Printer size={18} />
            Print
          </button>

          <Link to="/dashboard/customers/create">
            <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none print:hidden">
              <PackagePlus size={18} />
              Add Customer
            </button>
          </Link>

          <Link to="/dashboard/customers/map">
            <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-green-600 to-green-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-green-500/40 active:translate-y-0 active:shadow-none print:hidden">
              <MapPin size={18} />
              Customer Map
            </button>
          </Link>

          <div className="w-[180px]">
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                setPageIndex(0);
              }}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-gray-200 dark:border-gray-800">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="top_sold">Top Sold Order</SelectItem>
                <SelectItem value="low_sold">Low Sold Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div >

      {/* Print Only Header */}
      <div className="hidden print:block text-center mb-1">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight">CUSTOMER LIST</h1>
      </div>

      {/* Stats Cards */}
      < div className="flex flex-wrap gap-6 mb-6 print:hidden" >
        {stats?.map((item, idx) => (
          <div
            key={idx}
            className={`relative flex-1 min-w-60 overflow-hidden rounded-2xl bg-linear-to-br ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5`}
          >
            {/* Background Pattern */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">{item.label}</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {item.value}
                </h3>
              </div>
              <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                {item.icon}
              </div>
            </div>

            {/* Progress/Indicator line (optional visual flair) */}
            <div className="mt-4 h-1 w-full rounded-full bg-black/10">
              <div className="h-full w-2/3 rounded-full bg-white/40" />
            </div>
          </div>
        ))
        }
      </div >

      <Card className="pt-6 pb-2 border-none shadow-none">
        <CardHeader className="print:hidden">
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto w-full">
          {isLoading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : (
            <DataTable
              columns={customerColumns}
              data={customers}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={totalCustomers}
              onPageChange={setPageIndex}
              onSearch={(value) => {
                setSearchTerm(value);
              }}
              isFetching={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer and remove their data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!previewData}
        onOpenChange={(open) => !open && setPreviewData(null)}
      >
        <DialogContent className="max-w-3xl p-5 overflow-hidden bg-white">
          <div className="relative flex items-center justify-center">
            {previewData && (
              <>
                <img
                  src={previewData.images[previewData.index]}
                  alt="Customer Preview"
                  className="max-w-full max-h-[70vh] rounded-lg object-contain"
                />

                {/* Left Arrow (Previous) */}
                {previewData.images.length > 1 && (
                  <button
                    onClick={() =>
                      setPreviewData((prev) =>
                        prev
                          ? {
                            ...prev,
                            index:
                              prev.index === 0
                                ? prev.images.length - 1
                                : prev.index - 1,
                          }
                          : null
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                )}

                {/* Right Arrow (Next) */}
                {previewData.images.length > 1 && (
                  <button
                    onClick={() =>
                      setPreviewData((prev) =>
                        prev
                          ? {
                            ...prev,
                            index:
                              prev.index === prev.images.length - 1
                                ? 0
                                : prev.index + 1,
                          }
                          : null
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}

                {/* Counter */}
                {previewData.images.length > 1 && (
                  <div className="absolute bottom-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                    {previewData.index + 1} / {previewData.images.length}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!mapLocation}
        onOpenChange={(open) => !open && setMapLocation(null)}
      >
        <DialogContent className="sm:max-w-[700px] p-5 overflow-hidden bg-white">
          <div className="w-full h-[450px]">
            {mapLocation && (
              <MapEmbed location={mapLocation} width={700} height={450} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
                @media print {
                    .no-print, 
                    header, 
                    nav, 
                    aside, 
                    button, 
                    .print\\:hidden,
                    .flex.flex-wrap.items-center.justify-between.py-4.gap-4 {
                        display: none !important;
                    }
                    input, .max-w-sm { /* Hide search input specifically */
                        display: none !important;
                    }
                    html, body {
                        background: white !important;
                        overflow: visible !important;
                        height: auto !important;
                        color: black !important;
                        font-size: 10pt !important;
                    }
                    * {
                        color: black !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }
                    .text-4xl {
                        font-size: 14pt !important;
                        font-weight: bold !important;
                        margin-bottom: 5px !important;
                    }
                    .border, .Card, .CardContent, .pt-6 {
                        border: none !important;
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                        margin-top: 0 !important;
                    }
                    .bg-card {
                        background: none !important;
                        padding: 0 !important;
                    }
                    .p-6, .CardContent {
                        padding: 0 !important;
                    }
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        color: black !important;
                    }
                    th, td {
                        border: 1px solid #000 !important;
                        padding: 3px !important;
                        font-size: 7pt !important;
                        color: black !important;
                        text-align: left !important;
                    }
                    .text-right {
                        text-align: right !important;
                    }
                    th {
                        background-color: #f2f2f2 !important;
                        -webkit-print-color-adjust: exact;
                        font-weight: bold !important;
                    }

                    /* Force Company Name and Customer Name to same size */
                    td .flex.flex-col span {
                        font-size: 7pt !important;
                        font-weight: normal !important;
                        color: black !important;
                    }

                    /* Hide specific columns in print */
                    th:nth-child(3), td:nth-child(3) { /* Image column */
                        display: none !important;
                    }
                    th:nth-child(12), td:nth-child(12) { /* Status column */
                        display: none !important;
                    }
                    th:nth-child(13), td:nth-child(13) { /* Location column */
                        display: none !important;
                    }
                    th:last-child, td:last-child { /* Actions column */
                        display: none !important;
                    }

                    .mb-8, .mb-6, .pb-2, .pb-4 {
                        margin-bottom: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .mt-2, .mt-1 {
                        margin-top: 0 !important;
                    }
                    .hidden.print\\:block.mb-1 {
                        margin-bottom: 5px !important;
                        display: block !important;
                    }
                    .rounded-md.border {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    
                    /* Sticky columns fix for print */
                    .md\\:sticky {
                        position: static !important;
                        background: none !important;
                        shadow: none !important;
                    }
                }
            `}} />
    </div >
  );
}
