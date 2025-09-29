
import React, { useMemo } from 'react';
import { ExpenseTransaction } from '../types';
import { formatCurrency } from '../utils/formatter';
import Card from './ui/Card';

interface ExpenseBreakdownChartProps {
  transactions: ExpenseTransaction[];
}

const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ transactions }) => {
  const expenseData = useMemo(() => {
    const breakdown = new Map<string, number>();
    transactions.forEach(tx => {
      const currentAmount = breakdown.get(tx.expenseType) || 0;
      breakdown.set(tx.expenseType, currentAmount + tx.amount);
    });
    return Array.from(breakdown.entries())
      .map(([type, amount]) => ({ type, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const maxAmount = useMemo(() => {
    return Math.max(...expenseData.map(d => d.amount), 1); // Avoid division by zero
  }, [expenseData]);

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-slate-100">Desglose de Egresos</h3>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400">
            No hay egresos para mostrar.
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto pr-2">
            {expenseData.map(({ type, amount }) => {
                const barWidth = (amount / maxAmount) * 100;
                return (
                <div key={type} className="group">
                    <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-slate-300 truncate pr-2">{type}</span>
                    <span className="font-semibold text-slate-200">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                        className="bg-sky-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                        title={`${type}: ${formatCurrency(amount)}`}
                    ></div>
                    </div>
                </div>
                );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExpenseBreakdownChart;
