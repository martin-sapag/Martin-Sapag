
import React, { useState, useMemo } from 'react';
import { Program, Transaction, TransactionType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProgramDetail from './components/ProgramDetail';
import AddProgramModal from './components/AddProgramModal';
import AddTransactionModal from './components/AddTransactionModal';

export default function App() {
  const [programs, setPrograms] = useLocalStorage<Program[]>('programs', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  
  const [isAddProgramModalOpen, setAddProgramModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);

  const handleAddProgram = (program: Omit<Program, 'id'>) => {
    setPrograms(prev => [...prev, { ...program, id: crypto.randomUUID() }]);
    setAddProgramModalOpen(false);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID() } as Transaction]);
    setAddTransactionModalOpen(false);
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
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {selectedProgram ? (
          <ProgramDetail 
            program={selectedProgram}
            transactions={selectedProgramTransactions}
            onBack={handleGoToDashboard}
          />
        ) : (
          <Dashboard
            programs={programs}
            transactions={transactions}
            onSelectProgram={handleSelectProgram}
            onOpenAddProgramModal={() => setAddProgramModalOpen(true)}
            onOpenAddTransactionModal={() => setAddTransactionModalOpen(true)}
          />
        )}
      </main>

      {isAddProgramModalOpen && (
        <AddProgramModal
          onClose={() => setAddProgramModalOpen(false)}
          onAddProgram={handleAddProgram}
        />
      )}

      {isAddTransactionModalOpen && (
        <AddTransactionModal
          programs={programs}
          onClose={() => setAddTransactionModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
    </div>
  );
}
