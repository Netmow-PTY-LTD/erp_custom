import { baseApi } from "@/store/baseApi";
import type { Role } from "@/types/users";


export type RoleResponse = {
  status: boolean;
  message: string;
  data: Role | Role[];
};

export const roleApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL ROLES (GET /list)
    getAllRoles: builder.query<RoleResponse, void>({
      query: () => ({
        url: "/roles/list",
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    // ADD ROLE (POST /add)
    addRole: builder.mutation<RoleResponse, Partial<Role>>({
      query: (body) => ({
        url: "/roles/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    // GET SINGLE ROLE (GET /get/:id)
    getRoleById: builder.query<RoleResponse, string | number>({
      query: (id) => ({
        url: `/roles/get/${id}`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    // UPDATE ROLE (PUT /update/:id)
    updateRole: builder.mutation<
      RoleResponse,
      { id: string | number; body: Partial<Role> }
    >({
      query: ({ id, body }) => ({
        url: `/roles/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    // DELETE ROLE (DELETE /delete/:id)
    deleteRole: builder.mutation<RoleResponse, string | number>({
      query: (id) => ({
        url: `/roles/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),

  }),
});

export const {
  useGetAllRolesQuery,
  useAddRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApiService;
