

// 2
import { useState, useEffect, useRef, type UIEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users, CheckCircle2, Loader2 } from "lucide-react";
import { useGetAllStaffsQuery } from "@/store/features/staffs/staffApiService";
import { useAssignStaffMutation, useGetSalesRouteByIdQuery } from "@/store/features/salesRoute/salesRoute";
import type { Staff } from "@/types/staff.types";
import { toast } from "sonner";

type AssignStaffForm = {
  staffIds: number[];
};

type AssignRouteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
};

export default function AssignRouteModal({ isOpen, onClose, routeId }: AssignRouteModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const hasHydratedRef = useRef(false);

  const form = useForm<AssignStaffForm>({
    defaultValues: { staffIds: [] },
  });

  const { data, isFetching } = useGetAllStaffsQuery({
    page,
    limit,
    search: searchTerm,
    status: "active",
  }, {
    refetchOnMountOrArgChange: true
  });

  console.log("Staff data:", data);

  const { data: SalesRouteData } = useGetSalesRouteByIdQuery(routeId);
  const [assignStaff, { isLoading: isAssigning }] = useAssignStaffMutation();

  // Initialize assigned staff when modal opens
  useEffect(() => {
    if (
      isOpen &&
      !hasHydratedRef.current &&
      SalesRouteData?.data?.assignedStaffMembers
    ) {
      const ids = SalesRouteData.data.assignedStaffMembers.map((s) => s.id);
      form.reset({ staffIds: ids });
      hasHydratedRef.current = true;
    }
  }, [SalesRouteData, isOpen, form]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasHydratedRef.current = false;
      form.reset({ staffIds: [] });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(1);
      setAllStaff([]);
      setHasMore(true);
      setSearchTerm("");
    }
  }, [isOpen, form]);





  // Merge new data, avoid duplicates
  useEffect(() => {
    if (data?.data && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllStaff((prev) => {
        const combined = [...prev, ...data.data];
        const unique = combined.filter(
          (staff, index, self) => index === self.findIndex((s) => s.id === staff.id)
        );
        return unique;
      });
      setHasMore((data?.pagination?.total ?? 0) > allStaff.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen]);

  const toggleStaff = (id: number, value: number[]) =>
    value.includes(id) ? value.filter((s) => s !== id) : [...value, id];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleSelectAll = (field: any) => {
    if (field.value.length === allStaff.length) {
      field.onChange([]);
    } else {
      field.onChange(allStaff.map((s) => s.id));
    }
  };

  const handleAssignStaffs = async () => {
    const staffIds = form.getValues("staffIds");
    if (!routeId) return;

    try {
      const res = await assignStaff({ routeId, body: { staff_ids: staffIds } }).unwrap();
      if (res.status) {
        toast.success(res.message || "Staff assigned successfully");
        onClose();
      }
    } catch (error) {
      console.error("Assign staff error:", error);
    }
  };

  // Infinite scroll handler
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight && hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Staff</DialogTitle>
          <DialogDescription>
            Select one or more staff members to assign to this route.
          </DialogDescription>
        </DialogHeader>

        {/* SEARCH */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search staff..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
              setAllStaff([]);
              setHasMore(true);
            }}
          />
        </div>

        {/* STAFF LIST */}
        <Controller
          name="staffIds"
          control={form.control}
          render={({ field }) => (
            <>
              {allStaff.length > 0 && (
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleSelectAll(field)}>
                    {field.value.length === allStaff.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              )}

              <ScrollArea
                className="h-[300px] mt-2 border rounded-md p-2"
                onScroll={handleScroll}
              >
                <div className="space-y-2">
                  {allStaff.length > 0 ? (
                    allStaff.map((staff) => {
                      const isSelected = field.value.includes(staff.id);
                      const fullName = `${staff.first_name} ${staff.last_name}`;
                      return (
                        <div
                          key={staff.id}
                          className={`flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer ${isSelected ? "bg-accent/50" : ""
                            }`}
                          onClick={() => field.onChange(toggleStaff(staff.id, field.value))}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              field.onChange(toggleStaff(staff.id, field.value))
                            }
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                staff.thumb_url ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`
                              }
                            />
                            <AvatarFallback>
                              {fullName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{fullName}</span>
                            <span className="text-xs text-muted-foreground">{staff.position}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : !isFetching ? (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-20 mb-1" />
                      <p className="text-sm">No staff found.</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}

                  {isFetching && (
                    <div className="flex justify-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="mt-2 text-xs text-muted-foreground">
                {field.value.length} staff selected
              </div>

              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignStaffs}
                  disabled={field.value.length === 0 || isAssigning}
                >
                  {isAssigning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Assign
                </Button>
              </DialogFooter>
            </>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}












// /* eslint-disable react-hooks/incompatible-library */

// import { useState, useEffect, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   ArrowLeft,
//   Search,
//   Users,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react";
// import { Link, useParams } from "react-router";
// import { useGetAllStaffsQuery } from "@/store/features/staffs/staffApiService";
// import { useAssignStaffMutation, useGetSalesRouteByIdQuery } from "@/store/features/salesRoute/salesRoute";
// import type { Staff } from "@/types/staff.types";
// import { toast } from "sonner";

// /* ================= TYPES ================= */

// type AssignStaffForm = {
//   staffIds: number[];
// };

// /* ================= COMPONENT ================= */

// export default function AssignRoutePage() {
//   const { routeId } = useParams();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [allStaff, setAllStaff] = useState<Staff[]>([]);
//   const limit = 10;
//   const hasHydratedRef = useRef(false);


//   /* ================= RHF ================= */

//   const form = useForm<AssignStaffForm>({
//     defaultValues: {
//       staffIds: [],
//     },
//   });

//   /* ================= API ================= */

//   const { data, isLoading, isFetching } = useGetAllStaffsQuery({
//     page,
//     limit,
//     search: searchTerm,
//     status: "active",
//   });

//   const { data: SalesRouteData, isLoading: isLoadingSalesRoute } = useGetSalesRouteByIdQuery(routeId as string);
//   const [assignStaff] = useAssignStaffMutation();

//   /* ================= EFFECTS ================= */


//   useEffect(() => {
//     if (
//       !hasHydratedRef.current &&
//       SalesRouteData?.data?.assignedStaffMembers
//     ) {
//       const ids =
//         SalesRouteData.data.assignedStaffMembers.map(
//           (staff) => staff.id
//         );

//       form.reset({
//         staffIds: ids,
//       });

//       hasHydratedRef.current = true;
//     }
//   }, [SalesRouteData, form]);



//   useEffect(() => {
//     if (data?.data) {
//       if (page === 1) {
//         setAllStaff(data.data);
//       } else {
//         setAllStaff((prev) => [...prev, ...data.data]);
//       }
//     }
//   }, [data, page]);








//   /* ================= HELPERS ================= */

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setPage(1);
//   };

//   const toggleStaff = (id: number, value: number[]) => {
//     return value.includes(id)
//       ? value.filter((s) => s !== id)
//       : [...value, id];
//   };

//   const getInitials = (f?: string, l?: string) =>
//     `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();

//   const hasMore =
//     (data?.pagination?.total ?? 0) > allStaff.length;

//   /* ================= SUBMIT ================= */

//   const handleAssignStaffs = async () => {
//     if (!routeId) return;

//     const staffIds = form.getValues("staffIds");

//     try {
//       const res = await assignStaff({
//         routeId,
//         body: { staff_ids: staffIds },
//       }).unwrap();

//       if (res.status) {
//         toast.success(res.message || "Staff assigned successfully");
//       }
//     } catch (error) {
//       console.log("Assign staff error:", error);
//     }
//   };

//   /* ================= JSX ================= */

//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       {/* HEADER */}
//       <header className="sticky top-10 z-10 bg-white border-b px-4 py-4 sm:px-8">
//         <div className="max-w-2xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Link to="/dashboard/sales/sales-routes">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 rounded-full"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-lg font-bold">Assign Staff</h1>
//               <p className="text-xs text-muted-foreground">
//                 Route: Downtown Area
//               </p>
//             </div>
//           </div>

//           <Badge variant="secondary">
//             {form.watch("staffIds").length} Selected
//           </Badge>
//         </div>
//       </header>

//       {/* SEARCH */}
//       <div className="sticky top-24 z-10 px-4 pt-6 sm:px-8">
//         <div className="max-w-2xl mx-auto relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder="Search team members..."
//             className="pl-10 h-11"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </div>
//       </div>

//       {/* STAFF LIST */}
//       <main className="flex-1 px-4 sm:px-8 pb-32">
//         <div className="max-w-2xl mx-auto py-6">
//           <Controller
//             name="staffIds"
//             control={form.control}
//             render={({ field }) => (
//               <div className="space-y-2">
//                 {allStaff.length > 0 ? (
//                   data?.data?.map((staff) => {
//                     const isSelected = field.value.includes(staff.id);

//                     return (
//                       <div
//                         key={staff.id}
//                         onClick={() =>
//                           field.onChange(
//                             toggleStaff(staff.id, field.value)
//                           )
//                         }
//                         className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${isSelected
//                           ? "bg-blue-50 border-blue-100"
//                           : "hover:bg-slate-50"
//                           }`}
//                       >
//                         <div className="flex items-center gap-4">
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage src={staff.thumb_url} />
//                             <AvatarFallback>
//                               {getInitials(
//                                 staff.first_name,
//                                 staff.last_name
//                               )}
//                             </AvatarFallback>
//                           </Avatar>

//                           <div>
//                             <p className="text-sm font-semibold">
//                               {staff.first_name} {staff.last_name}
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               {staff.email}
//                             </p>
//                           </div>
//                         </div>

//                         <Checkbox
//                           checked={isSelected}
//                           onCheckedChange={() =>
//                             field.onChange(
//                               toggleStaff(staff.id, field.value)
//                             )
//                           }
//                         />
//                       </div>
//                     );
//                   })
//                 ) : !isLoading ? (
//                   <div className="text-center py-20">
//                     <Users className="h-10 w-10 mx-auto mb-2 text-slate-200" />
//                     <p className="text-sm text-slate-500">
//                       No members found
//                     </p>
//                   </div>
//                 ) : null}
//                 {hasMore && (
//                   <div className="py-10 flex justify-center">
//                     <Button
//                       variant="outline"
//                       onClick={() => setPage((p) => p + 1)}
//                       disabled={isFetching}
//                       className="
//         h-11 px-10 rounded-xl
//         text-xs font-semibold uppercase tracking-wider
//         border-slate-200 text-slate-600
//         hover:bg-slate-900 hover:text-white
//         transition-all duration-200
//         shadow-sm hover:shadow-md
//       "
//                     >
//                       {isFetching ? (
//                         <span className="flex items-center gap-2">
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                           Loading...
//                         </span>
//                       ) : (
//                         "Load More Staff"
//                       )}
//                     </Button>
//                   </div>
//                 )}


//               </div>
//             )}
//           />
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
//         <div className="max-w-2xl mx-auto flex justify-center gap-4">
//           <Button
//             variant="ghost"
//             className="min-w-[140px]"
//             onClick={() => form.setValue("staffIds", [])}
//           >
//             Clear All
//           </Button>

//           <Button
//             className="min-w-[180px] bg-blue-600 hover:bg-blue-700"
//             disabled={
//               isLoadingSalesRoute ||
//               form.watch("staffIds").length === 0
//             }
//             onClick={handleAssignStaffs}
//           >
//             <CheckCircle2 className="mr-2 h-4 w-4" />
//             Save Assignments
//           </Button>
//         </div>
//       </footer>

//     </div>
//   );
// }


