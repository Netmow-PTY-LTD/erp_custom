
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus } from "lucide-react";

// Helper to generate random numbers for dummy data
const randomAmount = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

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

// Summaries for today, this week, this month
const summaryData = {
  today: { income: randomAmount(2000, 5000), expense: randomAmount(500, 2000) },
  week: { income: randomAmount(10000, 25000), expense: randomAmount(3000, 10000) },
  month: { income: randomAmount(50000, 120000), expense: randomAmount(10000, 50000) },
};




export default function AccountingOverview() {



 const periods: Array<keyof typeof summaryData> = ["today", "week", "month"];







  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Accounting Overview</h2>

        <div className="flex gap-2">
          <Button variant="success">
            <Plus className="h-4 w-4 mr-1" /> Add Income
          </Button>

          <Button variant="destructive">
            <Plus className="h-4 w-4 mr-1" /> Add Expense
          </Button>
        </div>
      </div>

         {/* Summary Cards */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {periods.map((period) => {
    const data = summaryData[period];
    const periodLabel =
      period === "today" ? "Today" : period === "week" ? "This Week" : "This Month";
    const incomePercent = ((data.income / (data.income + data.expense)) * 100).toFixed(0);

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
              <span className="text-gray-500 dark:text-gray-400">Income</span>
              <p className="font-semibold text-lg">
                RM {data.income.toLocaleString()}.00
              </p>
            </div>
            <span className="font-semibold">{incomePercent}%</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Expense</span>
              <p className="font-semibold text-lg">
                RM {data.expense.toLocaleString()}.00
              </p>
            </div>
            <span className="font-semibold">{(100 - Number(incomePercent)).toFixed(0)}%</span>
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
              <LineChart data={trendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


