"use client";

import { Bell } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "@/store/features/notifications/notificationsApi";
import type { Notification } from "@/store/features/notifications/notificationsApi";
import { useAppSelector } from "@/store/store";

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return "🛒";
    case "stock":
      return "📦";
    case "payment":
      return "💰";
    case "customer":
      return "👤";
    case "system":
      return "⚙️";
    case "return":
      return "🔄";
    case "delivery":
      return "🚚";
    default:
      return "🔔";
  }
};

export function NotificationDropdown() {
  const user = useAppSelector((state) => state.auth.user);
  const isSuperadmin = user?.role?.name?.toLowerCase() === 'superadmin';

  const { data, isLoading } = useGetNotificationsQuery(undefined, {
    skip: !isSuperadmin,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unread || 0;

  const handleMarkAsRead = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          <DropdownMenuGroup>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  asChild
                  onPointerDown={(e) =>
                    !notification.is_read && handleMarkAsRead(e, notification.id)
                  }
                >
                  <a
                    href={notification.link || "#"}
                    className={`flex gap-3 w-full p-3 cursor-pointer relative ${
                      !notification.is_read ? "bg-muted/50" : ""
                    }`}
                  >
                    <span className="text-xl shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="absolute top-2 right-2 opacity-0 hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
                      title="Delete notification"
                    >
                      ×
                    </button>
                  </a>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <DropdownMenuItem asChild>
            <button
              onClick={handleMarkAllAsRead}
              className="w-full justify-center text-sm cursor-pointer flex"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
