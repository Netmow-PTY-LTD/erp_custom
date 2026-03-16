import { baseApi } from "@/store/baseApi";

export interface Notification {
  id: number;
  type: "order" | "stock" | "payment" | "customer" | "system" | "return" | "delivery";
  title: string;
  message: string;
  link?: string;
  reference_type?: string;
  reference_id?: number;
  is_read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  read_at?: string;
  created_at: string;
  timestamp: string;
}

export interface GetNotificationsResponse {
  status: boolean;
  message: string;
  data: {
    total: number;
    unread: number;
    notifications: Notification[];
  };
}

export interface UnreadCountResponse {
  status: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface MarkAsReadResponse {
  status: boolean;
  message: string;
  data: Notification;
}

export interface MarkAllAsReadResponse {
  status: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
  };
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ------------------------------------------
    // GET ALL NOTIFICATIONS
    // ------------------------------------------
    getNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    // ------------------------------------------
    // GET UNREAD COUNT
    // ------------------------------------------
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: [{ type: "Notifications", id: "UNREAD" }],
    }),

    // ------------------------------------------
    // MARK AS READ
    // ------------------------------------------
    markAsRead: builder.mutation<MarkAsReadResponse, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD" },
      ],
    }),

    // ------------------------------------------
    // MARK ALL AS READ
    // ------------------------------------------
    markAllAsRead: builder.mutation<MarkAllAsReadResponse, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD" },
      ],
    }),

    // ------------------------------------------
    // DELETE NOTIFICATION
    // ------------------------------------------
    deleteNotification: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
