
import React, { useMemo } from 'react';
import { Program, Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate, exportToCsv } from '../utils/formatter';
import { exportGeneralPdf } from '../utils/pdfGenerator';
import ProgramCard from './ProgramCard';
import ExportButton from './ui/ExportButton';
import { InfoCard } from './ui/Card';

interface DashboardProps {
  programs: Program[];
  transactions: Transaction[];
  onSelectProgram: (programId: string) => void;
  onOpenAddProgramModal: () => void;
  onOpenAddTransactionModal: () => void;
  onEditProgram: (program: Program) => void;
  onToggleProgramGhost: (programId: string) => void;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);


const Dashboard: React.FC<DashboardProps> = ({
  programs,
  transactions,
  onSelectProgram,
  onOpenAddProgramModal,
  onOpenAddTransactionModal,
  onEditProgram,
  onToggleProgramGhost
}) => {
  const summary = useMemo(() => {
    const activeTransactions = transactions.filter(t => !t.isGhosted);
    const activePrograms = programs.filter(p => !p.isGhosted);

    const totalIncome = activeTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = activeTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalAdminFees = activePrograms.reduce((totalFee, prog) => {
        const programIncome = activeTransactions
            .filter(t => t.programId === prog.id && t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        return totalFee + (programIncome * (prog.adminFeePercentage / 100));
    }, 0);

    return {
      totalIncome,
      totalExpenses,
      totalAdminFees,
      balance: totalIncome - totalExpenses - totalAdminFees,
    };
  }, [transactions, programs]);

  const handleExportGeneralCsv = () => {
    const headers = ['Programa', 'Tipo', 'Fecha', 'Detalle (Fuente/Gasto)', 'N° Factura', 'Monto', 'Estado'];
    
    const data = transactions
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(tx => {
            const programName = programs.find(p => p.id === tx.programId)?.name || 'N/A';
            const date = formatDate(tx.date);
            const status = tx.isGhosted ? 'Desactivado' : 'Activo';
            
            if (tx.type === TransactionType.INCOME) {
                return [
                    programName,
                    'Ingreso',
                    date,
                    tx.source,
                    '', // No invoice number for income
                    tx.amount,
                    status
                ];
            } else { // Expense
                return [
                    programName,
                    'Egreso',
                    date,
                    tx.expenseType,
                    tx.invoiceNumber,
                    tx.amount,
                    status
                ];
            }
        });
    
    exportToCsv('Informe_General_Fundacion.csv', headers, data);
  };
  
  const handleExportGeneralPdf = () => {
      exportGeneralPdf(programs, transactions, summary);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard title="Ingresos Totales" value={formatCurrency(summary.totalIncome)} color="text-green-400" />
          <InfoCard title="Costos Admin." value={formatCurrency(summary.totalAdminFees)} color="text-yellow-400" />
          <InfoCard title="Egresos Totales" value={formatCurrency(summary.totalExpenses)} color="text-red-400" />
          <InfoCard title="Balance General" value={formatCurrency(summary.balance)} color={summary.balance >= 0 ? "text-cyan-400" : "text-red-500"} />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onOpenAddProgramModal} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2">
            <PlusIcon />
            Nuevo Programa
          </button>
          <button onClick={onOpenAddTransactionModal} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:bg-sky-800 disabled:cursor-not-allowed" disabled={programs.filter(p => !p.isGhosted).length === 0}>
            <PlusIcon />
            Nueva Transacción
          </button>
          <div className="flex-1">
             <ExportButton 
                onExportCsv={handleExportGeneralCsv}
                onExportPdf={handleExportGeneralPdf}
                disabled={transactions.length === 0}
                label="Exportar General"
              />
          </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Programas</h2>
        {programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(program => {
              const programTransactions = transactions.filter(t => t.programId === program.id);
              return (
                <ProgramCard
                  key={program.id}
                  program={program}
                  transactions={programTransactions}
                  onClick={() => onSelectProgram(program.id)}
                  onEdit={onEditProgram}
                  onToggleGhost={onToggleProgramGhost}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800/50 rounded-lg">
            <p className="text-slate-400">No hay programas creados.</p>
            <p className="text-slate-500 text-sm mt-1">Haga clic en "Nuevo Programa" para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;