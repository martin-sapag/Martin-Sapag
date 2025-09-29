
export enum TransactionType {
  INCOME = 'INGRESO',
  EXPENSE = 'EGRESO',
}

interface BaseTransaction {
  id: string;
  programId: string;
  amount: number;
  date: string; 
  isGhosted?: boolean;
}

export interface IncomeTransaction extends BaseTransaction {
  type: TransactionType.INCOME;
  source: string;
}

export interface ExpenseTransaction extends BaseTransaction {
  type: TransactionType.EXPENSE;
  expenseType: string;
  invoiceNumber: string;
}

export type Transaction = IncomeTransaction | ExpenseTransaction;

export interface Program {
  id:string;
  name: string;
  adminFeePercentage: number;
  isGhosted?: boolean;
}