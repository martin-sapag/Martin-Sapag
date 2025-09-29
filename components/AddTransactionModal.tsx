
import React, { useState } from 'react';
import { Program, Transaction, TransactionType } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';

interface AddTransactionModalProps {
  programs: Program[];
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ programs, onClose, onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [programId, setProgramId] = useState<string>(programs[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!programId || isNaN(numericAmount) || numericAmount <= 0) return;

    const commonData = { programId, amount: numericAmount, date };

    // FIX: Cast the object to the expected union type to bypass TypeScript's excess property checking for discriminated unions.
    // This resolves errors for 'source', 'expenseType', and 'invoiceNumber' not being present on all members of the Transaction union type.
    if (type === TransactionType.INCOME) {
      onAddTransaction({ ...commonData, type, source } as Omit<Transaction, 'id'>);
    } else {
      onAddTransaction({ ...commonData, type, expenseType, invoiceNumber } as Omit<Transaction, 'id'>);
    }
  };
  
  const tabClasses = (isActive: boolean) => 
    `w-full py-2.5 text-sm font-medium leading-5 text-center rounded-lg transition-colors duration-200 focus:outline-none ${
      isActive ? 'bg-teal-600 text-white shadow' : 'text-slate-300 hover:bg-white/[0.12] hover:text-white'
    }`;


  return (
    <Modal title="Añadir Transacción" onClose={onClose}>
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
          <label htmlFor="program-select" className="block text-sm font-medium text-slate-300 mb-1">Programa</label>
          <select
            id="program-select"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
            required
          >
            <option value="" disabled>Seleccione un programa</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <Input label="Monto" id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" />
        <Input label={type === TransactionType.INCOME ? "Fecha de Ingreso" : "Fecha de Pago"} id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />

        {type === TransactionType.INCOME ? (
          <Input label="Fuente del Ingreso" id="source" value={source} onChange={e => setSource(e.target.value)} required />
        ) : (
          <>
            <Input label="Tipo de Gasto" id="expenseType" value={expenseType} onChange={e => setExpenseType(e.target.value)} required />
            <Input label="Número de Comprobante/Factura" id="invoiceNumber" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required />
          </>
        )}
        
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-white transition">Guardar Transacción</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;