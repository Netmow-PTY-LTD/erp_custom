"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Attendance() {
  return (
    <div className="max-w-5xl mx-auto py-6">
      <Card className="rounded-sm border shadow-sm">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-lg font-semibold">Attendance</CardTitle>

          <Button className="rounded-sm bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600">
            + Manual Entry
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Date */}
            <div className="space-y-1">
              <Label>Date</Label>
              <Input type="date" className="rounded-sm w-full" />
            </div>

            {/* Employee */}
            <div className="space-y-1">
              <Label>Employee</Label>
              <Input
                type="text"
                placeholder="Name / code"
                className="rounded-sm w-full"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label>Status</Label>
              <Select defaultValue="all">
                <SelectTrigger className="rounded-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Check-In</th>
                  <th className="p-3 text-left">Check-Out</th>
                  <th className="p-3 text-left">Hours</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-3">2025-01-15</td>
                  <td className="p-3">Md. Abdullah</td>
                  <td className="p-3">PRESENT</td>
                  <td className="p-3">09:05</td>
                  <td className="p-3">18:10</td>
                  <td className="p-3">8.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Note */}
          <p className="text-gray-400 text-xs pt-2">
            Manual attendance stored in <code>attendance_records</code>.  
            Later device logs can be integrated automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
