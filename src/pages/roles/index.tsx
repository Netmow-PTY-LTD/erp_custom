import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Admin", description: "Full system access" },
    { id: 2, name: "Manager", description: "Manage staff and reports" },
    { id: 3, name: "Staff", description: "Basic access" },
  ]);

  const [newRole, setNewRole] = useState({ name: "", description: "" });

  const addRole = () => {
    if (!newRole.name.trim()) return;
    setRoles([
      ...roles,
      {
        id: roles.length + 1,
        name: newRole.name,
        description: newRole.description,
      },
    ]);
    setNewRole({ name: "", description: "" });
  };

  const deleteRole = (id: number) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Roles</h1>

      {/* Add New Role */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Role name"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          />
          <Input
            placeholder="Role description"
            value={newRole.description}
            onChange={(e) =>
              setNewRole({ ...newRole, description: e.target.value })
            }
          />
          <Button onClick={addRole}>Add Role</Button>
        </CardContent>
      </Card>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <p className="text-gray-500">No roles created yet.</p>
          ) : (
            <ul className="space-y-4">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{role.name}</p>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  <Button variant="destructive" onClick={() => deleteRole(role.id)}>Delete</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

