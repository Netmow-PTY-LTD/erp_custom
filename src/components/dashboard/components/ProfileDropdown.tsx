"use client";

import { Link } from "react-router";
import useDialogState from "../../../hooks/use-dialog-state";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { SignOutDialog } from "../../sign-out-dialog";
import { useAppSelector } from "@/store/store";
import type { User } from "@/types/users.types";


export function ProfileDropdown() {

  const [open, setOpen] = useDialogState();
  const user = useAppSelector((state) => state.auth.user) as User | null;


  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="user_avater" />
              <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm leading-none font-medium">{user?.name ?? 'Username'}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email ?? 'example@gmail.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings/profile">
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>

          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
            Sign out
            <DropdownMenuShortcut className="text-current">
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
