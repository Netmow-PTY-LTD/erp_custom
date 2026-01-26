import { baseApi } from "@/store/baseApi";

interface TableDataResponse {
  status: boolean;
  message: string;
  data: {
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  };
}

interface TablesListResponse {
  status: boolean;
  message: string;
  data: { tableName: string }[] | string[];
}

export const databaseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTables: builder.query<TablesListResponse, void>({
      query: () => ({
        url: `/data_management/tables`,
        method: "GET",
      }),
    }),
    getTableData: builder.query<TableDataResponse, { tableName: string; page?: number; limit?: number }>({
      query: ({ tableName, page = 1, limit = 10 }) => ({
        url: `/data_management/tables/${tableName}`,
        method: "GET",
        params: { page, limit },
      }),
    }),
    updateTableRow: builder.mutation<{ status: boolean; message: string; data: any }, { tableName: string; id: number | string; data: Record<string, any> }>({
      query: ({ tableName, id, data }) => ({
        url: `/data_management/tables/${tableName}`,
        method: "PUT",
        body: { id, ...data },
      }),
    }),
  }),
});

export const {
  useGetAllTablesQuery,
  useGetTableDataQuery,
  useUpdateTableRowMutation,
} = databaseApiService;
