
import React from 'react';
import { Transaction, TransactionType, IncomeTransaction, ExpenseTransaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatter';

interface TransactionsTableProps {
  transactions: Transaction[];
  onToggleTransactionGhost: (transactionId: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const GhostIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.685-6.945H12v-2.25h8.685A9.004 9.004 0 0012 3c-4.97 0-9 4.03-9 9s4.03 9 9 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onToggleTransactionGhost, onEditTransaction }) => {
  if (transactions.length === 0) {
    return <div className="text-center py-6 bg-slate-800/50 rounded-lg text-slate-400">No hay transacciones registradas.</div>;
  }
  
  const isExpense = transactions.some(t => t.type === TransactionType.EXPENSE);
  
  return (
    <div className="overflow-x-auto bg-slate-800 rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-slate-300">
        <thead className="bg-slate-700/50 text-xs text-slate-400 uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">Fecha</th>
            <th scope="col" className="px-4 py-3">{isExpense ? 'Tipo de Gasto' : 'Fuente'}</th>
            {isExpense && <th scope="col" className="px-4 py-3">N° Factura</th>}
            <th scope="col" className="px-4 py-3 text-right">Monto</th>
            <th scope="col" className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tx) => (
            <tr key={tx.id} className={`border-b border-slate-700 transition-opacity ${tx.isGhosted ? 'opacity-40' : 'hover:bg-slate-700/50'}`}>
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(tx.date)}</td>
              <td className="px-4 py-3">
                {tx.type === TransactionType.INCOME
                  ? (tx as IncomeTransaction).source
                  : (tx as ExpenseTransaction).expenseType}
              </td>
              {isExpense && <td className="px-4 py-3">{(tx as ExpenseTransaction).invoiceNumber}</td>}
              <td className={`px-4 py-3 font-medium text-right ${tx.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(tx.amount)}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  <button 
                    onClick={() => onEditTransaction(tx)}
                    className="p-1 text-slate-500 hover:text-sky-400 rounded-full transition-colors"
                    aria-label={`Editar transacción del ${formatDate(tx.date)}`}
                  >
                      <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onToggleTransactionGhost(tx.id)}
                    className="p-1 text-slate-500 hover:text-yellow-500 rounded-full transition-colors"
                    aria-label={`Activar/Desactivar transacción del ${formatDate(tx.date)}`}
                    title={tx.isGhosted ? 'Activar Transacción' : 'Desactivar Transacción'}
                  >
                      <GhostIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;