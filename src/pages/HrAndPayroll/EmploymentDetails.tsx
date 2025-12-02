
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function EmploymentDetails() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Employment Details
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Employee */}
            <div className="space-y-1 w-full">
              <Label>Employee</Label>
              <Select>
                <SelectTrigger className="rounded-sm w-full">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abdullah">Md. Abdullah</SelectItem>
                  <SelectItem value="aisyah">Nur Aisyah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Type */}
            <div className="space-y-1 w-full">
              <Label>Employment Type</Label>
              <Select defaultValue="permanent">
                <SelectTrigger className="rounded-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">PERMANENT</SelectItem>
                  <SelectItem value="contract">CONTRACT</SelectItem>
                  <SelectItem value="intern">INTERN</SelectItem>
                  <SelectItem value="part-time">PART-TIME</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Joining Date */}
            <div className="space-y-1 w-full">
              <Label>Joining Date</Label>
              <Input type="date" className="rounded-sm w-full" />
            </div>

            {/* Probation End */}
            <div className="space-y-1 w-full">
              <Label>Probation End</Label>
              <Input type="date" className="rounded-sm w-full" />
            </div>

            {/* Current Status */}
            <div className="space-y-1 w-full">
              <Label className="w-full">Current Status</Label>
              <Select defaultValue="active">
                <SelectTrigger className="rounded-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">ACTIVE</SelectItem>
                  <SelectItem value="inactive">INACTIVE</SelectItem>
                  <SelectItem value="terminated">TERMINATED</SelectItem>
                  <SelectItem value="resigned">RESIGNED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Structure */}
            <div className="space-y-1 w-full">
              <Label>Salary Structure</Label>
              <Select defaultValue="standard">
                <SelectTrigger className="rounded-sm w-full">
                  <SelectValue placeholder="Select Structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Staff</SelectItem>
                  <SelectItem value="manager">Manager Grade</SelectItem>
                  <SelectItem value="exec">Executive Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Basic Salary */}
            <div className="space-y-1 w-full">
              <Label>Basic Salary</Label>
              <Input type="number" className="rounded-sm w-full" placeholder="0.00" />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm dark:bg-gray-700 dark:hover:bg-gray-600">
              Save Employment Details
            </Button>
          </div>

          <p className="text-gray-400 text-xs pt-4">
            Employment details stored in <code>employee_employment_details</code> with salary mapping to salary structures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
