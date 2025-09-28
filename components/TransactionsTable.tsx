
import React from 'react';
import { Transaction, TransactionType, IncomeTransaction, ExpenseTransaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatter';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <div className="text-center py-6 bg-slate-800/50 rounded-lg text-slate-400">No hay transacciones registradas.</div>;
  }
  
  const isExpense = transactions[0]?.type === TransactionType.EXPENSE;
  
  return (
    <div className="overflow-x-auto bg-slate-800 rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-slate-300">
        <thead className="bg-slate-700/50 text-xs text-slate-400 uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">Fecha</th>
            <th scope="col" className="px-4 py-3">{isExpense ? 'Tipo de Gasto' : 'Fuente'}</th>
            {isExpense && <th scope="col" className="px-4 py-3">N° Factura</th>}
            <th scope="col" className="px-4 py-3 text-right">Monto</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tx) => (
            <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700/50">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
