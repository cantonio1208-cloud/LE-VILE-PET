/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  Calendar,
  User,
  Dog,
  Scissors,
  CreditCard,
  ChevronRight,
  Printer,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HistoryScreen: React.FC = () => {
  const {
    appointments,
    clients,
    pets,
    services,
    staff,
    getClientById,
    getPetById,
    getServiceById,
    invoices,
    setSelectedAppointmentId,
  } = useApp();

  const [periodFilter, setPeriodFilter] = useState<'all' | 'hoje' | '7dias' | 'mes'>('all');
  const [selectedClientFilter, setSelectedClientFilter] = useState('all');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState('all');
  const [selectedPaymentStatusFilter, setSelectedPaymentStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredHistory = appointments.filter((apt) => {
    const client = getClientById(apt.clientId);
    const pet = getPetById(apt.petId);

    const matchesSearch =
      client?.name.toLowerCase().includes(search.toLowerCase()) ||
      pet?.name.toLowerCase().includes(search.toLowerCase()) ||
      apt.notes?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (periodFilter === 'hoje' && apt.date !== '2026-11-02') return false;
    if (periodFilter === 'mes' && !apt.date.startsWith('2026-11')) return false;

    if (selectedClientFilter !== 'all' && apt.clientId !== selectedClientFilter) return false;
    if (selectedServiceFilter !== 'all' && apt.serviceId !== selectedServiceFilter) return false;
    if (selectedStaffFilter !== 'all' && apt.staffId !== selectedStaffFilter) return false;
    if (selectedPaymentStatusFilter !== 'all' && apt.paymentStatus !== selectedPaymentStatusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Export Tools */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Auditoria & Prontuários
          </span>
          <h2 className="text-xl font-bold text-[#101010]">Histórico de Atendimentos Realizados</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-white px-3.5 py-2 text-xs font-semibold text-[#555555] hover:bg-[#F6F6F4]"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir Histórico</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#101010] pb-2 border-b border-[#E9E9E6]">
          <Filter className="h-4 w-4 text-[#FFC400]" />
          <span>Filtros Avançados de Busca</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Período */}
          <div>
            <label className="block text-[#777777] font-semibold mb-1">Período</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as any)}
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
            >
              <option value="all">Todo o Histórico</option>
              <option value="hoje">Hoje (02 Nov 2026)</option>
              <option value="mes">Novembro / 2026</option>
            </select>
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-[#777777] font-semibold mb-1">Cliente / Tutor</label>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
            >
              <option value="all">Todos os Tutores</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Serviço */}
          <div>
            <label className="block text-[#777777] font-semibold mb-1">Tipo de Serviço</label>
            <select
              value={selectedServiceFilter}
              onChange={(e) => setSelectedServiceFilter(e.target.value)}
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
            >
              <option value="all">Todos os Serviços</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Funcionário */}
          <div>
            <label className="block text-[#777777] font-semibold mb-1">Profissional</label>
            <select
              value={selectedStaffFilter}
              onChange={(e) => setSelectedStaffFilter(e.target.value)}
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
            >
              <option value="all">Toda a Equipe</option>
              {staff.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Pagamento */}
          <div>
            <label className="block text-[#777777] font-semibold mb-1">Pagamento</label>
            <select
              value={selectedPaymentStatusFilter}
              onChange={(e) => setSelectedPaymentStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
            >
              <option value="all">Todas as Situações</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Parcial">Parcial</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                <th className="pb-3 pl-2">Data & Horário</th>
                <th className="pb-3">Animal (Pet)</th>
                <th className="pb-3">Tutor Responsável</th>
                <th className="pb-3">Procedimento</th>
                <th className="pb-3">Profissional</th>
                <th className="pb-3">Valor Cobrado</th>
                <th className="pb-3">Situação Pagamento</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1EE]">
              {filteredHistory.map((apt) => {
                const client = getClientById(apt.clientId);
                const pet = getPetById(apt.petId);
                const service = getServiceById(apt.serviceId);
                const invoice = invoices.find((i) => i.appointmentId === apt.id);

                return (
                  <tr
                    key={apt.id}
                    onClick={() => setSelectedAppointmentId(apt.id)}
                    className="hover:bg-[#F9F9F8] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 pl-2 font-mono font-bold text-[#101010]">
                      <span className="block">{apt.date}</span>
                      <span className="text-[11px] text-[#777777]">{apt.time}</span>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&q=80'}
                          alt={pet?.name}
                          className="h-8 w-8 rounded-lg object-cover border border-[#E9E9E6]"
                        />
                        <div>
                          <span className="font-bold text-[#101010] block group-hover:text-[#B45309]">
                            {pet?.name}
                          </span>
                          <span className="text-[11px] text-[#777777]">{pet?.breed}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="font-semibold text-[#222222] block">{client?.name}</span>
                      <span className="text-[11px] text-[#777777]">{client?.phone}</span>
                    </td>

                    <td className="py-3.5 text-[#222222] font-medium">
                      <span>{service?.name || 'Procedimento'}</span>
                      {apt.transport?.enabled && (
                        <span className="text-[10px] text-[#B45309] block">
                          + Táxi Dog ({apt.transport.type})
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-[#555555]">
                      <span>{apt.staffName}</span>
                    </td>

                    <td className="py-3.5 font-mono font-extrabold text-[#101010]">
                      R$ {apt.amount.toFixed(2)}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.paymentStatus === 'Pago'
                            ? 'bg-[#F0FDF4] text-[#15803D]'
                            : apt.paymentStatus === 'Parcial'
                            ? 'bg-[#FFFBEB] text-[#B45309]'
                            : 'bg-[#FEF2F2] text-[#DC2626]'
                        }`}
                      >
                        {apt.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'Concluído'
                            ? 'bg-[#F0FDF4] text-[#15803D]'
                            : apt.status === 'Em andamento'
                            ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                            : 'bg-[#FFFBEB] text-[#B45309]'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="py-3.5 pr-2 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointmentId(apt.id);
                        }}
                        className="rounded-lg border border-[#E9E9E6] px-3 py-1.5 text-xs font-semibold text-[#101010] hover:bg-[#101010] hover:text-white transition-all"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
