import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export default function AssignStaffPage() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const staffList = [
    { id: 1, name: "Ahmad Hassan", email: "ahmad.hassan@kiraa.my" },
    { id: 2, name: "David Tan", email: "david.tan@kiraa.my" },
    { id: 3, name: "Fatimah Ali", email: "fatimah.ali@kiraa.my" },
    { id: 4, name: "Hassan Ibrahim", email: "hassan.ibrahim@kiraa.my" },
    { id: 5, name: "Jawa Gara", email: "apangjawa@gmail.com" },
    { id: 6, name: "Lim Wei Ming", email: "lim.weiming@kiraa.my" },
    { id: 7, name: "Maksudul Haque", email: "maksud.netmov@gmail.com" },
    { id: 8, name: "Priya Nair", email: "priya.nair@kiraa.my" },
    { id: 9, name: "Raj Kumar", email: "raj.kumar@kiraa.my" },
    { id: 10, name: "Sales Staff", email: "sales.staff@kiraa.my" },
    { id: 11, name: "Sales Person", email: "sales@example.com" },
  ];

  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = useMemo(() => 
    staffList.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, staffList]);

  const toggleStaff = (id: number) => {
    setSelectedStaffIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 1. SIMPLE HEADER */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-4 sm:px-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard/sales/sales-routes">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Assign Staff</h1>
              <p className="text-xs text-muted-foreground">Route: Downtown Area</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none px-3">
            {selectedStaffIds.length} Selected
          </Badge>
        </div>
      </header>

      {/* 2. SEARCH BAR */}
      <div className="px-4 pt-6 sm:px-8">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search team members..." 
            className="pl-10 h-11 bg-slate-50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. SCROLLABLE STAFF LIST */}
      <main className="flex-1 px-4 sm:px-8 pb-32">
        <div className="max-w-2xl mx-auto py-6">
          <div className="space-y-2">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => {
                const isSelected = selectedStaffIds.includes(staff.id);
                return (
                  <div 
                    key={staff.id}
                    onClick={() => toggleStaff(staff.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected 
                      ? "bg-blue-50/40 border-blue-100 shadow-sm" 
                      : "bg-white border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border shadow-sm text-[12px]">
                        <AvatarFallback className={isSelected ? "bg-blue-600 text-white" : "bg-slate-100"}>
                          {getInitials(staff.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                          {staff.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[180px] sm:max-w-xs">{staff.email}</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => toggleStaff(staff.id)}
                      className="h-5 w-5 rounded-full border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20">
                <Users className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No members found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. FIXED ACTION FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="flex-1 text-slate-500"
            onClick={() => setSelectedStaffIds([])}
          >
            Clear All
          </Button>
          <Button 
            className="flex-2 bg-blue-600 hover:bg-blue-700 h-10 rounded-xl shadow-lg shadow-blue-100"
            disabled={selectedStaffIds.length === 0}
            onClick={() => console.log("Assigned IDs:", selectedStaffIds)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Save Assignments
          </Button>
        </div>
      </footer>
    </div>
  );
}