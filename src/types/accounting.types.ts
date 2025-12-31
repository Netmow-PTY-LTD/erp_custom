
// -------------------- OVERVIEW --------------------
export type Overview = {
    daily: {
      income: number;
      expense: number;
    },
    weekly: {
      income: number;
      expense: number;  
    },
    monthly: {
      income: number;
      expense: number;  
    },
    yearly: {
      income: number;
      expense: number;  
    },
};


// -------------------- INCOME / EXPENSE --------------------
export type IncomeExpense = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status: any;
  id: number;
  title: string;
  credit_head_id: number;
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

// -------------------- Credit Head --------------------
export type CreditHead = {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
};

// -------------------- Debit Head --------------------
export type DebitHead = {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
};