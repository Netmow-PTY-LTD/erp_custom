"use client";
import { useGetStaffSalesChartsQuery } from "@/store/features/admin/dashboardApiService";
import { useAppSelector } from "@/store/store";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export function StaffsSalesOverview() {
    const user = useAppSelector((state) => state.auth.user);
    const { data: staffSalesCharts } = useGetStaffSalesChartsQuery({ staff_id: user?.id || 0 }, { skip: !user?.id });
    const currency = useAppSelector((state) => state.currency.value);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={staffSalesCharts}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${currency} ${value}`}
                    tickCount={5}
                    padding={{ top: 20 }}
                />

                {/* 👇 Tooltip */}
                <Tooltip
                    formatter={(value) => {
                        const num = typeof value === "number" ? value : 0;
                        return [`${currency} ${num.toFixed(2)}`, "Total"];
                    }}
                />

                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
