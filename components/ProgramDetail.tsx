
import React, { useMemo } from 'react';
import { Program, Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils/formatter';
import TransactionsTable from './TransactionsTable';
import { InfoCard } from './ui/Card';

interface ProgramDetailProps {
  program: Program;
  transactions: Transaction[];
  onBack: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, transactions, onBack }) => {
  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const adminFee = income * (program.adminFeePercentage / 100);
    const balance = income - expenses - adminFee;

    return { income, expenses, adminFee, balance };
  }, [transactions, program]);

  const incomeTransactions = useMemo(() => transactions.filter(t => t.type === TransactionType.INCOME), [transactions]);
  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === TransactionType.EXPENSE), [transactions]);


  return (
    <div className="space-y-8">
      <div>
        <button onClick={onBack} className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 transition">
          <ArrowLeftIcon />
          Volver al Dashboard
        </button>
        <h2 className="text-3xl font-bold text-slate-100">{program.name}</h2>
        <p className="text-teal-400">{program.adminFeePercentage}% para Costos Administrativos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard title="Ingresos" value={formatCurrency(summary.income)} color="text-green-400" />
        <InfoCard title="Costo Admin." value={formatCurrency(summary.adminFee)} color="text-yellow-400" />
        <InfoCard title="Egresos" value={formatCurrency(summary.expenses)} color="text-red-400" />
        <InfoCard title="Balance Disponible" value={formatCurrency(summary.balance)} color={summary.balance >= 0 ? "text-cyan-400" : "text-red-500"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Detalle de Ingresos</h3>
          <TransactionsTable transactions={incomeTransactions} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Detalle de Egresos</h3>
          <TransactionsTable transactions={expenseTransactions} />
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
