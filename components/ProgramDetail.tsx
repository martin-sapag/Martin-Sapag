
import React, { useMemo } from 'react';
import { Program, Transaction, TransactionType, ExpenseTransaction } from '../types';
import { formatCurrency, formatDate, exportToCsv } from '../utils/formatter';
import { exportProgramPdf } from '../utils/pdfGenerator';
import TransactionsTable from './TransactionsTable';
import ExportButton from './ui/ExportButton';
import { InfoCard } from './ui/Card';

interface ProgramDetailProps {
  program: Program;
  transactions: Transaction[];
  onBack: () => void;
  onToggleTransactionGhost: (transactionId: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, transactions, onBack, onToggleTransactionGhost, onEditTransaction }) => {
  const summary = useMemo(() => {
    const activeTransactions = transactions.filter(t => !t.isGhosted);

    const income = activeTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = activeTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const adminFee = income * (program.adminFeePercentage / 100);
    const balance = income - expenses - adminFee;

    return { income, expenses, adminFee, balance };
  }, [transactions, program]);

  const incomeTransactions = useMemo(() => transactions.filter(t => t.type === TransactionType.INCOME), [transactions]);
  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === TransactionType.EXPENSE) as ExpenseTransaction[], [transactions]);

  const handleExportProgramCsv = () => {
    const headers = ['Tipo', 'Fecha', 'Detalle (Fuente/Gasto)', 'N° Factura', 'Monto', 'Estado'];

    const data = transactions
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(tx => {
            const date = formatDate(tx.date);
            const status = tx.isGhosted ? 'Desactivado' : 'Activo';
            
            if (tx.type === TransactionType.INCOME) {
                return [
                    'Ingreso',
                    date,
                    tx.source,
                    '', // No invoice number for income
                    tx.amount,
                    status
                ];
            } else { // Expense
                return [
                    'Egreso',
                    date,
                    tx.expenseType,
                    tx.invoiceNumber,
                    tx.amount,
                    status
                ];
            }
        });
    
    const safeFilename = program.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    exportToCsv(`Informe_${safeFilename}.csv`, headers, data);
  };
  
  const handleExportProgramPdf = () => {
    exportProgramPdf(program, transactions, summary);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 transition">
                <ArrowLeftIcon />
                Volver al Dashboard
            </button>
            <ExportButton 
                onExportCsv={handleExportProgramCsv}
                onExportPdf={handleExportProgramPdf}
                disabled={transactions.length === 0}
                label="Exportar Informe"
            />
        </div>
        <h2 className={`text-3xl font-bold text-slate-100 transition-opacity ${program.isGhosted ? 'opacity-50' : ''}`}>{program.name}</h2>
        <p className={`text-teal-400 transition-opacity ${program.isGhosted ? 'opacity-50' : ''}`}>{program.adminFeePercentage}% para Costos Administrativos</p>
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
          <TransactionsTable transactions={incomeTransactions} onToggleTransactionGhost={onToggleTransactionGhost} onEditTransaction={onEditTransaction} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Detalle de Egresos</h3>
          <TransactionsTable transactions={expenseTransactions} onToggleTransactionGhost={onToggleTransactionGhost} onEditTransaction={onEditTransaction} />
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;