import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function AssignRoutePage() {
  // -----------------------------
  // STAFF AS OBJECTS
  // -----------------------------
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

  // Track selected staff by id
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);

  const toggleStaff = (id: number) => {
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const saveStaff = () => {
    const selected = staffList.filter((s) => selectedStaff.includes(s.id));
    alert("Saved Staff:\n" + selected.map((s) => `${s.name} (${s.email})`).join("\n"));
  };

  // -----------------------------
  // CUSTOMERS (unchanged)
  // -----------------------------
  const customerList = [
    { name: "Arif R.", tag: "noloc" },
    { name: "Digital Works Sdn Bhd", tag: "geo" },
    { name: "Global Trading Co", tag: "geo" },
    { name: "Innovative Systems", tag: "geo" },
    { name: "Modern Enterprises", tag: "geo" },
    { name: "Muzahid Khan", tag: "noloc" },
    { name: "Office Hub Malaysia", tag: "geo" },
    { name: "Premier Business Group", tag: "geo" },
    { name: "Smart Office Solutions", tag: "geo" },
    { name: "Tech Solutions Sdn Bhd", tag: "geo" },
  ];

  const [selectedCustomers, setSelectedCustomers] = useState([
    "Arif R.",
    "Modern Enterprises",
  ]);

  const toggleCustomer = (name: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const saveCustomers = () => {
    alert("Saved Customers:\n" + selectedCustomers.join("\n"));
  };

  return (
    <div className="w-full p-6">
      
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Assign to Downtown Area</h1>
          <p className="text-muted-foreground">Add staff and customers to this route.</p>
        </div>
        <Link to="/dashboard/sales-routes">
            <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Back to Routes
            </Button>
        </Link>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* STAFF SECTION */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staff</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select staff to assign to this route.
            </p>
          </CardHeader>

          <CardContent>
            <div className="border rounded-md h-[330px] overflow-hidden">
              <ScrollArea className="h-full px-4 py-2">

                {staffList.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 py-1 text-sm cursor-pointer mb-2"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedStaff.includes(s.id)}
                      onChange={() => toggleStaff(s.id)}
                    />

                    <div className="flex gap-1 leading-tight">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.email}</span>
                    </div>
                  </label>
                ))}

              </ScrollArea>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={saveStaff}>Save Staff</Button>
            </div>
          </CardContent>
        </Card>

        {/* CUSTOMERS SECTION */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customers</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select customers to include in this route.
            </p>
          </CardHeader>

          <CardContent>
            <div className="border rounded-md h-[330px] overflow-hidden">
              <ScrollArea className="h-full px-4 py-2">
                {customerList.map((c) => (
                  <label
                    key={c.name}
                    className="flex items-center gap-3 py-1 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedCustomers.includes(c.name)}
                      onChange={() => toggleCustomer(c.name)}
                    />

                    <span>{c.name}</span>

                    {c.tag === "geo" && (
                      <Badge className="bg-green-600">Geotagged</Badge>
                    )}
                    {c.tag === "noloc" && (
                      <Badge className="bg-yellow-600">No location</Badge>
                    )}
                  </label>
                ))}
              </ScrollArea>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={saveCustomers}>Save Customers</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
