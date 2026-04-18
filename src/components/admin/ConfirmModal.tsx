import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-white/10 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-display font-bold text-white uppercase">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white uppercase text-sm font-bold">
            Cancelar
          </button>
          <button onClick={() => { onConfirm(); onCancel(); }} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase text-sm transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
