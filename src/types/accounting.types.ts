

// -------------------- OVERVIEW --------------------
export type Overview = {
  total_income: number;
  total_expense: number;
  total_payroll: number;
  net_profit: number;
};


// -------------------- INCOME / EXPENSE --------------------
export type IncomeExpense = {
  id: number;
  title: string;
  amount: number;
  income_date?: string;   // for income
  expense_date?: string;  // for expense
  description?: string;
};


// -------------------- PAYROLL --------------------
export type Payroll = {
  id: number;
  staff_id: number;
  salary_month: string; // e.g., "2025-01"
  net_salary: number;
  status: string;
};