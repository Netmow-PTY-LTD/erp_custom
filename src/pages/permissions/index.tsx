import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Permission {
  id: number;
  name: string;
  module: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 1, name: "view_staff", module: "Staff" },
    { id: 2, name: "edit_staff", module: "Staff" },
    { id: 3, name: "view_attendance", module: "Attendance" },
    { id: 4, name: "edit_roles", module: "Settings" },
    { id: 5, name: "edit_permissions", module: "Settings" },
  ]);

  const [newPermission, setNewPermission] = useState({
    name: "",
    module: "",
  });

  const addPermission = () => {
    if (!newPermission.name.trim() || !newPermission.module.trim()) return;

    setPermissions([
      ...permissions,
      {
        id: permissions.length + 1,
        name: newPermission.name,
        module: newPermission.module,
      },
    ]);

    setNewPermission({ name: "", module: "" });
  };

  const deletePermission = (id: number) => {
    setPermissions(permissions.filter((permission) => permission.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Permissions</h1>

      {/* Add New Permission */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Permission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Permission name (e.g., create_user)"
            value={newPermission.name}
            onChange={(e) =>
              setNewPermission({ ...newPermission, name: e.target.value })
            }
          />
          <Input
            placeholder="Module (e.g., Users, Attendance)"
            value={newPermission.module}
            onChange={(e) =>
              setNewPermission({ ...newPermission, module: e.target.value })
            }
          />
          <Button onClick={addPermission}>Add Permission</Button>
        </CardContent>
      </Card>

      {/* Permissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          {permissions.length === 0 ? (
            <p className="text-gray-500">No permissions created yet.</p>
          ) : (
            <ul className="space-y-4">
              {permissions.map((perm) => (
                <li
                  key={perm.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{perm.name}</p>
                    <p className="text-sm text-gray-600">
                      Module: {perm.module}
                    </p>
                  </div>

                  <Button variant="destructive" onClick={() => deletePermission(perm.id)} >Delete</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
