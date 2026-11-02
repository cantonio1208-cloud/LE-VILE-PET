/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Scissors, DollarSign, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';

export const NewServiceModal: React.FC = () => {
  const { isNewServiceOpen, closeNewService, addService } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Banho');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [price, setPrice] = useState(80.0);

  if (!isNewServiceOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;

    addService({
      name,
      category,
      description,
      durationMinutes,
      price,
      active: true,
    });

    closeNewService();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Catálogo de Serviços
            </span>
            <h2 className="text-lg font-bold text-[#101010]">Cadastrar Novo Serviço</h2>
          </div>
          <button
            onClick={closeNewService}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1">
              Nome do Serviço *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ex: Tosa Bebê Artística, Banho Terapêutico..."
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1">
              Categoria *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
            >
              <option value="Banho">Banho</option>
              <option value="Tosa">Tosa</option>
              <option value="Banho e tosa">Banho e tosa</option>
              <option value="Creche">Creche</option>
              <option value="Hotelzinho">Hotelzinho</option>
              <option value="Serviços adicionais">Serviços adicionais</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Duração (minutos)
              </label>
              <input
                type="number"
                step="5"
                min="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs font-mono text-[#222222]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Preço Base (R$) *
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs font-mono font-bold text-[#101010]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1">
              Descrição Detalhada do Procedimento
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as etapas, produtos utilizados e diferenciais Le Ville..."
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
            <button
              type="button"
              onClick={closeNewService}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
            >
              Salvar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
