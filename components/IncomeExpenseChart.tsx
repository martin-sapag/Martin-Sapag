
import React from 'react';
import { formatCurrency } from '../utils/formatter';
import Card from './ui/Card';

interface IncomeExpenseChartProps {
  income: number;
  expenses: number;
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ income, expenses }) => {
  const maxValue = Math.max(income, expenses, 1); // Avoid division by zero, use 1 as min
  const incomeHeight = (income / maxValue) * 100;
  const expenseHeight = (expenses / maxValue) * 100;

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-slate-100">Ingresos vs. Egresos</h3>
      {income === 0 && expenses === 0 ? (
         <div className="flex items-center justify-center h-48 text-slate-400">
            No hay datos para mostrar.
         </div>
      ) : (
        <div className="flex justify-around items-end h-48 space-x-4 p-4">
            <div className="flex flex-col items-center flex-1">
              <div className="text-sm font-bold text-green-400">{formatCurrency(income)}</div>
              <div
                  className="w-16 bg-green-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${incomeHeight}%` }}
                  title={`Ingresos: ${formatCurrency(income)}`}
              ></div>
              <div className="text-xs text-slate-400 mt-2">Ingresos</div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="text-sm font-bold text-red-400">{formatCurrency(expenses)}</div>
              <div
                  className="w-16 bg-red-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${expenseHeight}%` }}
                  title={`Egresos: ${formatCurrency(expenses)}`}
              ></div>
              <div className="text-xs text-slate-400 mt-2">Egresos</div>
            </div>
        </div>
      )}
    </Card>
  );
};

export default IncomeExpenseChart;
