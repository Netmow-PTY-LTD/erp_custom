"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { useAppSelector } from "@/store/store";
import { useGetAccountingChartDataQuery, useGetAccountingOverviewQuery } from "@/store/features/accounting/accoutntingApiService";
import type { Overview } from "@/types/accounting.types";

// Helper to generate random numbers for dummy data
const randomAmount = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// Generate dummy trend data for the last 30 days
const generateTrendData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      income: randomAmount(2000, 5000),
      expense: randomAmount(500, 2000),
    });
  }
  return data;
};

const trendData = generateTrendData();



export default function AccountingOverview() {
  const { data: accountingOverview } = useGetAccountingOverviewQuery();

  const summaryData = accountingOverview?.data;

  const periods: (keyof Overview)[] = ["daily", "weekly", "monthly", "yearly"];

  const currency = useAppSelector((state) => state.currency.value);

  const { data: chartData } = useGetAccountingChartDataQuery();

  console.log("chartData", chartData);

  const chartTrendData = chartData?.data || trendData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Accounting Overview</h2>

        <div className="flex gap-2">
          <Link to={"/dashboard/accounting/add-income"}>
            <Button variant="outline-info">
              <Plus className="h-4 w-4" /> Add Income
            </Button>
          </Link>

          <Link to={"/dashboard/accounting/add-expanse"}>
            <Button variant="info">
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {summaryData &&
          periods.map((period) => {
            const data = summaryData[period];
            const periodLabel =
              period === "daily"
                ? "Today"
                : period === "weekly"
                ? "This Week"
                : period === "monthly"
                ? "This Month"
                : "This Year";

            const income = Number(data.income) || 0;
            const expense = Number(data.expense) || 0;

            let incomePercent = 0;
            let expensePercent = 0;

            if (income === 0 && expense === 0) {
              incomePercent = 0;
              expensePercent = 0;
            } else if (income > 0 && expense === 0) {
              incomePercent = 100;
              expensePercent = 0;
            } else if (expense > 0 && income === 0) {
              incomePercent = 0;
              expensePercent = 100;
            } else {
              const total = income + expense;
              incomePercent = Math.round((income / total) * 100);
              expensePercent = 100 - incomePercent; // GUARANTEED consistency
            }

            const netProfit = data.income - data.expense;

            return (
              <Card
                key={period}
                className="rounded-xl shadow border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {periodLabel}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-900 dark:text-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Income
                      </span>
                      <p className="font-semibold text-lg">
                        {currency} {data.income.toLocaleString()}.00
                      </p>
                    </div>
                    <span className="font-semibold">{incomePercent}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Expense
                      </span>
                      <p className="font-semibold text-lg">
                        {currency} {data.expense.toLocaleString()}.00
                      </p>
                    </div>
                    <span className="font-semibold">
                      {expensePercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Net Profit
                      </span>
                      <p className="font-semibold text-lg">
                        {currency} {netProfit.toLocaleString()}.00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Last 30 Days Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartTrendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  name="Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
