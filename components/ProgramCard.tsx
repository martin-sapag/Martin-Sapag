
import React, { useMemo } from 'react';
import { Program, Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatter';

interface ProgramCardProps {
  program: Program;
  transactions: Transaction[];
  onClick: () => void;
  onEdit: (program: Program) => void;
  onToggleGhost: (programId: string) => void;
}

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const GhostIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.685-6.945H12v-2.25h8.685A9.004 9.004 0 0012 3c-4.97 0-9 4.03-9 9s4.03 9 9 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const ProgramCard: React.FC<ProgramCardProps> = ({ program, transactions, onClick, onEdit, onToggleGhost }) => {
  const balance = useMemo(() => {
    const activeTransactions = transactions.filter(t => !t.isGhosted);

    const income = activeTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = activeTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const adminFee = income * (program.adminFeePercentage / 100);

    return income - expenses - adminFee;
  }, [transactions, program]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(program);
  }
  
  const handleToggleGhost = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleGhost(program.id);
  }

  const cardClasses = `relative bg-slate-800 rounded-lg p-6 shadow-lg transition-all duration-300 ${
      program.isGhosted
      ? 'opacity-50 grayscale cursor-default'
      : 'hover:shadow-cyan-500/20 hover:ring-2 hover:ring-slate-700 cursor-pointer transform hover:-translate-y-1'
  }`;

  return (
    <div 
        onClick={!program.isGhosted ? onClick : undefined}
        className={cardClasses}
    >
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <button 
          onClick={handleToggleGhost}
          className="p-1 text-slate-500 hover:text-yellow-400 rounded-full transition-colors"
          aria-label={`Activar/desactivar programa ${program.name}`}
          title={program.isGhosted ? 'Activar Programa' : 'Desactivar Programa'}
        >
          <GhostIcon className="h-5 w-5"/>
        </button>
        <button 
          onClick={handleEdit}
          className="p-1 text-slate-500 hover:text-sky-400 rounded-full transition-colors"
          aria-label={`Editar programa ${program.name}`}
        >
          <PencilIcon />
        </button>
      </div>

      <h3 className="text-xl font-bold text-white truncate pr-20">{program.name}</h3>
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