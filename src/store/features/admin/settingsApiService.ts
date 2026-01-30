import { baseApi } from "@/store/baseApi";
import type { Settings } from "@/types/types";

interface PosLayoutSettings {
  columns: {
    mobile: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  gap: number;
  showImages: boolean;
  cardStyle: "standard" | "compact" | "bordered";
}

interface LayoutData {
  pos: PosLayoutSettings;
}

type LayoutSettingsResponse = {
  status: boolean;
  message: string;
  data: LayoutData;
};

type SettingsResponse = {
  status: boolean;
  message: string;
  data: Settings;
};

export const settingsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettingsInfo: builder.query<SettingsResponse, void>({
      query: () => ({
        url: `/settings/company/profile`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateSettingsInfo: builder.mutation<SettingsResponse, Partial<Settings>>({
      query: (body) => ({
        url: `/settings/company/profile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getLayoutSettings: builder.query<LayoutSettingsResponse, void>({
      query: () => ({
        url: `/settings/layout`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateLayoutSettings: builder.mutation<LayoutSettingsResponse, LayoutData>({
      query: (body) => ({
        url: `/settings/layout`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getEInvoiceSettings: builder.query<any, void>({
      query: () => ({
        url: `/settings/einvoice`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateEInvoiceSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: `/settings/einvoice`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getGoogleMapsSettings: builder.query<any, void>({
      query: () => ({
        url: `/settings/google-maps`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateGoogleMapsSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: `/settings/google-maps`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getNumberingSequences: builder.query<any, void>({
      query: () => ({
        url: `/settings/numbering-sequences`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateNumberingSequences: builder.mutation<any, any>({
      query: (body) => ({
        url: `/settings/numbering-sequences`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsInfoQuery,
  useUpdateSettingsInfoMutation,
  useGetLayoutSettingsQuery,
  useUpdateLayoutSettingsMutation,
  useGetEInvoiceSettingsQuery,
  useUpdateEInvoiceSettingsMutation,
  useGetGoogleMapsSettingsQuery,
  useUpdateGoogleMapsSettingsMutation,
  useGetNumberingSequencesQuery,
  useUpdateNumberingSequencesMutation
} = settingsApiService;
