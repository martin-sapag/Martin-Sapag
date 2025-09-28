
import React, { useMemo } from 'react';
import { Program, Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatter';

interface ProgramCardProps {
  program: Program;
  transactions: Transaction[];
  onClick: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, transactions, onClick }) => {
  const balance = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const adminFee = income * (program.adminFeePercentage / 100);

    return income - expenses - adminFee;
  }, [transactions, program]);

  return (
    <div 
        onClick={onClick}
        className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-slate-700 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold text-white truncate">{program.name}</h3>
      <p className="text-sm text-slate-400 mb-4">Costo Admin: {program.adminFeePercentage}%</p>
      <div className="mt-4">
        <p className="text-xs text-slate-400">Balance Disponible</p>
        <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-cyan-400' : 'text-red-500'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
};

export default ProgramCard;
