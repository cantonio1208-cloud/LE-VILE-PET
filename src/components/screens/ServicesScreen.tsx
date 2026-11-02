/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';

export const ServicesScreen: React.FC = () => {
  const { services, openNewService, toggleServiceActive, openNewAppointment } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories: ServiceCategory[] = [
    'Banho',
    'Tosa',
    'Banho e tosa',
    'Creche',
    'Hotelzinho',
    'Serviços adicionais',
  ];

  const filteredServices = services.filter((s) => {
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Catálogo & Tabela de Preços
          </span>
          <h2 className="text-xl font-bold text-[#101010]">Serviços Profissionais Le Ville</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
          >
            <option value="all">Todas as Categorias ({services.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => openNewService()}
            className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>NOVO SERVIÇO</span>
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                <th className="pb-3 pl-2">Serviço</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Descrição Operacional</th>
                <th className="pb-3">Duração</th>
                <th className="pb-3">Preço Base</th>
                <th className="pb-3">Situação</th>
                <th className="pb-3 pr-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1EE]">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-[#F9F9F8] transition-colors">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF9F5] text-[#101010] border border-[#E9E9E6]">
                        <Scissors className="h-4 w-4 text-[#FFC400]" />
                      </div>
                      <span className="font-bold text-[#101010]">{service.name}</span>
                    </div>
                  </td>

                  <td className="py-4">
                    <span className="font-semibold text-[#555555] bg-[#F6F6F4] px-2.5 py-1 rounded-md text-[11px]">
                      {service.category}
                    </span>
                  </td>

                  <td className="py-4 text-[#555555] max-w-sm">
                    <span className="line-clamp-2 leading-relaxed">{service.description}</span>
                  </td>

                  <td className="py-4 font-mono text-[#555555]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#999999]" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </td>

                  <td className="py-4 font-mono font-extrabold text-sm text-[#101010]">
                    R$ {service.price.toFixed(2)}
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        service.active
                          ? 'bg-[#F0FDF4] text-[#15803D]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {service.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td className="py-4 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openNewAppointment()}
                        className="rounded-md bg-[#FFC400]/20 text-[#101010] hover:bg-[#FFC400] px-2.5 py-1 text-[11px] font-bold transition-all"
                      >
                        Agendar
                      </button>

                      <button
                        onClick={() => toggleServiceActive(service.id)}
                        className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all ${
                          service.active
                            ? 'border-[#E9E9E6] text-[#777777] hover:bg-[#FEF2F2] hover:text-[#DC2626]'
                            : 'border-[#BBF7D0] text-[#15803D] hover:bg-[#F0FDF4]'
                        }`}
                      >
                        {service.active ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
