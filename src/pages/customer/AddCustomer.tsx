"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddCustomer() {
  const [status, setStatus] = useState("Active");
  const [route, setRoute] = useState("");

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      {/* Back Button */}
      <Button variant="outline" className="mb-4">← Back to Customers</Button>

      {/* Basic Information */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input placeholder="Enter name" />
          </div>
          <div>
            <Label>Company</Label>
            <Input placeholder="Enter company" />
          </div>
          <div>
            <Label>Email</Label>
            <Input placeholder="Enter email" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="Enter phone" />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Address</h3>
        <div className="space-y-4">
          <div>
            <Label>Address</Label>
            <Textarea placeholder="Enter address" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>City</Label>
              <Input placeholder="Start typing city..." />
            </div>
            <div>
              <Label>State</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selangor">Selangor</SelectItem>
                  <SelectItem value="Kuala Lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="Johor">Johor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input placeholder="Enter postal code" />
            </div>
            <div>
              <Label>Country</Label>
              <Input value="Malaysia" disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input placeholder="Enter latitude" />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input placeholder="Enter longitude" />
            </div>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Account</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Credit Limit (RM)</Label>
            <Input type="number" defaultValue={0.0} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Assign to Route</Label>
            <Select value={route} onValueChange={setRoute}>
              <SelectTrigger>
                <SelectValue placeholder="-- Select Route --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Route A">Route A</SelectItem>
                <SelectItem value="Route B">Route B</SelectItem>
                <SelectItem value="Route C">Route C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <Button>Add Customer</Button>
      </div>
    </div>
  );
}
