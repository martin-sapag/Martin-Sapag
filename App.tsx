
import React, { useState, useMemo } from 'react';
import { Program, Transaction, TransactionType, IncomeTransaction, ExpenseTransaction } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProgramDetail from './components/ProgramDetail';
import AddProgramModal from './components/AddProgramModal';
import AddTransactionModal from './components/AddTransactionModal';
import EditProgramModal from './components/EditProgramModal';
import EditTransactionModal from './components/EditTransactionModal';

export default function App() {
  const [programs, setPrograms] = useLocalStorage<Program[]>('programs', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  
  const [isAddProgramModalOpen, setAddProgramModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);


  const handleAddProgram = (program: Omit<Program, 'id'>) => {
    setPrograms(prev => [...prev, { ...program, id: crypto.randomUUID(), isGhosted: false }]);
    setAddProgramModalOpen(false);
  };

  const handleUpdateProgram = (updatedProgram: Program) => {
    setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
    setEditingProgram(null);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID(), isGhosted: false } as Transaction]);
    setAddTransactionModalOpen(false);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    setEditingTransaction(null);
  };

  const handleToggleProgramGhost = (programId: string) => {
    setPrograms(prev =>
      prev.map(p =>
        p.id === programId ? { ...p, isGhosted: !p.isGhosted } : p
      )
    );
  };

  const handleToggleTransactionGhost = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === transactionId ? { ...t, isGhosted: !t.isGhosted } : t
      )
    );
  };

  const selectedProgram = useMemo(() => {
    if (!selectedProgramId) return null;
    return programs.find(p => p.id === selectedProgramId) || null;
  }, [selectedProgramId, programs]);

  const selectedProgramTransactions = useMemo(() => {
    if (!selectedProgramId) return [];
    return transactions.filter(t => t.programId === selectedProgramId);
  }, [selectedProgramId, transactions]);

  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
  };

  const handleGoToDashboard = () => {
    setSelectedProgramId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {selectedProgram ? (
          <ProgramDetail 
            program={selectedProgram}
            transactions={selectedProgramTransactions}
            onBack={handleGoToDashboard}
            onToggleTransactionGhost={handleToggleTransactionGhost}
            onEditTransaction={setEditingTransaction}
          />
        ) : (
          <Dashboard
            programs={programs}
            transactions={transactions}
            onSelectProgram={handleSelectProgram}
            onOpenAddProgramModal={() => setAddProgramModalOpen(true)}
            onOpenAddTransactionModal={() => setAddTransactionModalOpen(true)}
            onEditProgram={setEditingProgram}
            onToggleProgramGhost={handleToggleProgramGhost}
          />
        )}
      </main>
      
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} mAIruba. All rights reserved.</p>
      </footer>

      {isAddProgramModalOpen && (
        <AddProgramModal
          onClose={() => setAddProgramModalOpen(false)}
          onAddProgram={handleAddProgram}
        />
      )}

      {isAddTransactionModalOpen && (
        <AddTransactionModal
          programs={programs.filter(p => !p.isGhosted)}
          onClose={() => setAddTransactionModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}

      {editingProgram && (
        <EditProgramModal
          program={editingProgram}
          onClose={() => setEditingProgram(null)}
          onUpdateProgram={handleUpdateProgram}
        />
      )}

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          programs={programs.filter(p => !p.isGhosted)}
          onClose={() => setEditingTransaction(null)}
          onUpdateTransaction={handleUpdateTransaction}
        />
      )}
    </div>
  );
}