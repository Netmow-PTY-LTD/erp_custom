import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useGetAllRolesQuery, useGetRoleByIdQuery } from "@/store/features/role/roleApiService";


type Role = {
  id: number;
  display_name: string;
};

export function RoleSelectField({
  field,
  disabled,
}: {
  field: { value?: number; onChange: (v: number) => void };
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Fetch roles with search
  const { data, isLoading } = useGetAllRolesQuery({
    page: 1,
    limit: 10,
    search: query,
  });

  // Fetch single role (for edit mode)
  const { data: singleData } = useGetRoleByIdQuery(field.value!, {
    skip: !field.value,
  });

  const list: Role[] = Array.isArray(data?.data) ? data.data : [];

  const selected =
    list.find((r) => Number(r.id) === Number(field.value)) ||
    (singleData?.data?.id &&
    Number(singleData.data.id) === Number(field.value)
      ? singleData.data
      : undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-between"
        >
          {selected ? selected.display_name : "Select Role..."}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput
            placeholder="Search roles..."
            onValueChange={setQuery}
          />

          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>

            <CommandGroup>
              {isLoading && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              )}

              {!isLoading &&
                list.map((role) => (
                  <CommandItem
                    key={role.id}
                    value={role.display_name}
                    onSelect={() => {
                      field.onChange(Number(role.id));
                      setOpen(false);
                    }}
                  >
                    {role.display_name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
