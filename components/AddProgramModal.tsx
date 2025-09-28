
import React, { useState } from 'react';
import { Program } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';

interface AddProgramModalProps {
  onClose: () => void;
  onAddProgram: (program: Omit<Program, 'id'>) => void;
}

const AddProgramModal: React.FC<AddProgramModalProps> = ({ onClose, onAddProgram }) => {
  const [name, setName] = useState('');
  const [adminFeePercentage, setAdminFeePercentage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = parseFloat(adminFeePercentage);
    if (name && !isNaN(fee) && fee >= 0 && fee <= 100) {
      onAddProgram({ name, adminFeePercentage: fee });
    }
  };

  return (
    <Modal title="Añadir Nuevo Programa" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Programa"
          id="program-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Porcentaje de Costo Administrativo (%)"
          id="admin-fee"
          type="number"
          value={adminFeePercentage}
          onChange={(e) => setAdminFeePercentage(e.target.value)}
          required
          min="0"
          max="100"
          step="0.01"
        />
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-white transition">Guardar Programa</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProgramModal;
