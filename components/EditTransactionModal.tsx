
import React, { useState, useEffect } from 'react';
import { Program, Transaction, TransactionType, IncomeTransaction, ExpenseTransaction } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';

interface EditTransactionModalProps {
  transaction: Transaction;
  programs: Program[];
  onClose: () => void;
  onUpdateTransaction: (transaction: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, programs, onClose, onUpdateTransaction }) => {
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [programId, setProgramId] = useState<string>(transaction.programId);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [date, setDate] = useState(transaction.date);
  
  // State for Income
  const [source, setSource] = useState(
      transaction.type === TransactionType.INCOME ? (transaction as IncomeTransaction).source : ''
  );

  // State for Expense
  const [expenseType, setExpenseType] = useState(
    transaction.type === TransactionType.EXPENSE ? (transaction as ExpenseTransaction).expenseType : ''
  );
  const [invoiceNumber, setInvoiceNumber] = useState(
    transaction.type === TransactionType.EXPENSE ? (transaction as ExpenseTransaction).invoiceNumber : ''
  );

  useEffect(() => {
    setType(transaction.type);
    setProgramId(transaction.programId);
    setAmount(String(transaction.amount));
    setDate(transaction.date);
    if (transaction.type === TransactionType.INCOME) {
        setSource((transaction as IncomeTransaction).source);
        setExpenseType('');
        setInvoiceNumber('');
    } else {
        setSource('');
        setExpenseType((transaction as ExpenseTransaction).expenseType);
        setInvoiceNumber((transaction as ExpenseTransaction).invoiceNumber);
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!programId || isNaN(numericAmount) || numericAmount <= 0) return;

    const commonData = { id: transaction.id, programId, amount: numericAmount, date };

    if (type === TransactionType.INCOME) {
      onUpdateTransaction({ ...commonData, type, source });
    } else {
      onUpdateTransaction({ ...commonData, type, expenseType, invoiceNumber });
    }
  };
  
  const tabClasses = (isActive: boolean) => 
    `w-full py-2.5 text-sm font-medium leading-5 text-center rounded-lg transition-colors duration-200 focus:outline-none ${
      isActive ? 'bg-teal-600 text-white shadow' : 'text-slate-300 hover:bg-white/[0.12] hover:text-white'
    }`;

  return (
    <Modal title="Editar Transacción" onClose={onClose}>
      <div className="w-full mb-4">
        <div className="flex space-x-1 rounded-xl bg-slate-700 p-1">
          <button onClick={() => setType(TransactionType.INCOME)} className={tabClasses(type === TransactionType.INCOME)}>
            Ingreso
          </button>
          <button onClick={() => setType(TransactionType.EXPENSE)} className={tabClasses(type === TransactionType.EXPENSE)}>
            Egreso
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="program-select-edit" className="block text-sm font-medium text-slate-300 mb-1">Programa</label>
          <select
            id="program-select-edit"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
            required
          >
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <Input label="Monto" id="amount-edit" type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" />
        <Input label={type === TransactionType.INCOME ? "Fecha de Ingreso" : "Fecha de Pago"} id="date-edit" type="date" value={date} onChange={e => setDate(e.target.value)} required />

        {type === TransactionType.INCOME ? (
          <Input label="Fuente del Ingreso" id="source-edit" value={source} onChange={e => setSource(e.target.value)} required />
        ) : (
          <>
            <Input label="Tipo de Gasto" id="expenseType-edit" value={expenseType} onChange={e => setExpenseType(e.target.value)} required />
            <Input label="Número de Comprobante/Factura" id="invoiceNumber-edit" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required />
          </>
        )}
        
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-white transition">Guardar Cambios</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTransactionModal;
