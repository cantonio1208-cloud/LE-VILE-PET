/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  Dog,
  Calendar,
  CreditCard,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';

export const ClientsScreen: React.FC = () => {
  const {
    clients,
    pets,
    appointments,
    invoices,
    selectedClientId,
    setSelectedClientId,
    setSelectedPetId,
    openNewClient,
    openNewPet,
    openNewAppointment,
    openRegisterPayment,
    getPetsByClientId,
    getAppointmentsByClientId,
    getInvoicesByClientId,
    setCurrentScreen,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [financialFilter, setFinancialFilter] = useState<'all' | 'pendente' | 'em_dia'>('all');
  const [activeTab, setActiveTab] = useState<'pets' | 'atendimentos' | 'financeiro'>('pets');

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.phone.includes(localSearch) ||
      c.cpf.includes(localSearch);

    if (!matchesSearch) return false;

    const clientInvoices = getInvoicesByClientId(c.id);
    const hasPending = clientInvoices.some((i) => i.balanceDue > 0);

    if (financialFilter === 'pendente' && !hasPending) return false;
    if (financialFilter === 'em_dia' && hasPending) return false;

    return true;
  });

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const clientPets = selectedClient ? getPetsByClientId(selectedClient.id) : [];
  const clientAppointments = selectedClient ? getAppointmentsByClientId(selectedClient.id) : [];
  const clientInvoices = selectedClient ? getInvoicesByClientId(selectedClient.id) : [];

  const clientTotalPending = clientInvoices.reduce((acc, curr) => acc + curr.balanceDue, 0);
  const clientTotalSpent = clientInvoices.reduce((acc, curr) => acc + curr.amountPaid, 0);

  // If a client is selected, show the Client Detail view
  if (selectedClient) {
    return (
      <div className="space-y-6">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedClientId(null)}
            className="flex items-center gap-2 rounded-xl border border-[#E9E9E6] bg-white px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#F6F6F4] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Lista de Clientes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openNewPet(selectedClient.id)}
              className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-white px-3.5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#F6F6F4]"
            >
              <Plus className="h-3.5 w-3.5 text-[#FFC400]" />
              <span>Adicionar Pet a Este Tutor</span>
            </button>

            <button
              onClick={() => openNewAppointment(selectedClient.id)}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Agendar Atendimento</span>
            </button>
          </div>
        </div>

        {/* Client Header Card */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#101010] text-[#FFC400] text-2xl font-bold shadow-xs">
                {selectedClient.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-[#101010]">{selectedClient.name}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      clientTotalPending > 0
                        ? 'bg-[#FEF2F2] text-[#DC2626]'
                        : 'bg-[#F0FDF4] text-[#15803D]'
                    }`}
                  >
                    {clientTotalPending > 0 ? `Débito em Aberto (R$ ${clientTotalPending.toFixed(2)})` : 'Situação Financeira em Dia'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#555555]">
                  <span>CPF: <strong className="text-[#222222] font-mono">{selectedClient.cpf}</strong></span>
                  <span>·</span>
                  <span>Desde: <strong className="text-[#222222]">{selectedClient.registeredAt}</strong></span>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-[#101010] font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#FFC400]" />
                    <span>
                      {selectedClient.address.street}, {selectedClient.address.number}
                      {selectedClient.address.complement && ` (${selectedClient.address.complement})`} -{' '}
                      {selectedClient.address.neighborhood}, {selectedClient.address.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${selectedClient.phone}`}
                className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] px-3.5 py-2 text-xs font-semibold text-[#222222] hover:bg-[#F6F6F4]"
              >
                <Phone className="h-4 w-4 text-[#777777]" />
                <span>{selectedClient.phone}</span>
              </a>

              <a
                href={`https://wa.me/${selectedClient.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#20BD5A]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Abrir WhatsApp</span>
              </a>
            </div>
          </div>

          {selectedClient.notes && (
            <div className="mt-4 p-3 rounded-xl bg-[#FAF9F5] border border-[#F2EFE5] text-xs text-[#555555]">
              <strong className="text-[#222222]">Observações do Cadastro: </strong>
              {selectedClient.notes}
            </div>
          )}
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#E9E9E6] bg-white p-4">
            <span className="text-[11px] font-medium text-[#777777] block mb-1">Animais Cadastrados</span>
            <span className="text-xl font-bold font-mono text-[#101010]">{clientPets.length} pets</span>
          </div>

          <div className="rounded-xl border border-[#E9E9E6] bg-white p-4">
            <span className="text-[11px] font-medium text-[#777777] block mb-1">Total de Atendimentos</span>
            <span className="text-xl font-bold font-mono text-[#101010]">{clientAppointments.length} visitas</span>
          </div>

          <div className="rounded-xl border border-[#E9E9E6] bg-white p-4">
            <span className="text-[11px] font-medium text-[#777777] block mb-1">Total Já Gasto</span>
            <span className="text-xl font-bold font-mono text-[#15803D]">
              R$ {clientTotalSpent.toFixed(2)}
            </span>
          </div>

          <div className="rounded-xl border border-[#E9E9E6] bg-white p-4">
            <span className="text-[11px] font-medium text-[#777777] block mb-1">Saldo em Aberto</span>
            <span className={`text-xl font-bold font-mono ${clientTotalPending > 0 ? 'text-[#DC2626]' : 'text-[#15803D]'}`}>
              R$ {clientTotalPending.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Tabs: Pets / Atendimentos / Financeiro */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E9E9E6] pb-3">
            <button
              onClick={() => setActiveTab('pets')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'pets'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              Animais Vinculados ({clientPets.length})
            </button>

            <button
              onClick={() => setActiveTab('atendimentos')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'atendimentos'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              Histórico de Atendimentos ({clientAppointments.length})
            </button>

            <button
              onClick={() => setActiveTab('financeiro')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'financeiro'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              Histórico Financeiro & Recibos ({clientInvoices.length})
            </button>
          </div>

          {/* Tab 1: Pets Vinculados */}
          {activeTab === 'pets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {clientPets.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPetId(p.id);
                    setCurrentScreen('pets');
                  }}
                  className="group cursor-pointer rounded-xl border border-[#E9E9E6] bg-white p-4 shadow-xs hover:border-[#FFC400] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="h-16 w-16 rounded-xl object-cover border border-[#E9E9E6]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#101010] group-hover:text-[#B45309] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[10px] bg-[#FAF9F5] border border-[#E9E9E6] px-1.5 py-0.5 rounded text-[#555555]">
                          {p.sex}
                        </span>
                      </div>
                      <span className="text-xs text-[#777777] block">{p.breed}</span>
                      <span className="text-[11px] text-[#444444] font-medium block">
                        Porte {p.size} · {p.weight} kg · {p.age}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F1F1EE] space-y-1 text-[11px] text-[#555555]">
                    {p.allergies !== 'Nenhuma alergia conhecida.' && p.allergies !== 'Nenhuma.' && (
                      <p className="text-[#DC2626] truncate">⚠️ {p.allergies}</p>
                    )}
                    <p className="text-[#777777] truncate">{p.specialCare}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E9E9E6] flex items-center justify-between text-xs font-bold text-[#101010]">
                    <span>Ver Prontuário Completo</span>
                    <ChevronRight className="h-4 w-4 text-[#777777] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}

              <div
                onClick={() => openNewPet(selectedClient.id)}
                className="cursor-pointer rounded-xl border-2 border-dashed border-[#CCCCCC] p-6 flex flex-col items-center justify-center text-center hover:border-[#101010] hover:bg-[#FBFBFA] transition-all min-h-[160px]"
              >
                <div className="h-10 w-10 rounded-full bg-[#FAF9F5] border border-[#E9E9E6] flex items-center justify-center mb-2">
                  <Plus className="h-5 w-5 text-[#101010]" />
                </div>
                <span className="text-xs font-bold text-[#101010]">Cadastrar Novo Animal</span>
                <span className="text-[11px] text-[#777777]">Vincular a {selectedClient.name}</span>
              </div>
            </div>
          )}

          {/* Tab 2: Histórico de Atendimentos */}
          {activeTab === 'atendimentos' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                    <th className="pb-3 pl-2">Data e Hora</th>
                    <th className="pb-3">Animal</th>
                    <th className="pb-3">Procedimento</th>
                    <th className="pb-3">Profissional</th>
                    <th className="pb-3">Valor</th>
                    <th className="pb-3">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F1EE]">
                  {clientAppointments.map((apt) => {
                    const pet = pets.find((p) => p.id === apt.petId);

                    return (
                      <tr key={apt.id} className="hover:bg-[#F9F9F8]">
                        <td className="py-3 pl-2 font-mono font-bold text-[#101010]">
                          {apt.date} às {apt.time}
                        </td>
                        <td className="py-3 font-semibold text-[#101010]">{pet?.name}</td>
                        <td className="py-3 text-[#555555]">{apt.notes || 'Banho e higienização Le Ville'}</td>
                        <td className="py-3 text-[#555555]">{apt.staffName}</td>
                        <td className="py-3 font-mono font-bold text-[#101010]">
                          R$ {apt.amount.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              apt.status === 'Concluído'
                                ? 'bg-[#F0FDF4] text-[#15803D]'
                                : 'bg-[#FFFBEB] text-[#B45309]'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Financeiro & Recibos */}
          {activeTab === 'financeiro' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                      <th className="pb-3 pl-2">Nº Recibo</th>
                      <th className="pb-3">Descrição</th>
                      <th className="pb-3">Vencimento</th>
                      <th className="pb-3">Valor Total</th>
                      <th className="pb-3">Pago</th>
                      <th className="pb-3">Saldo</th>
                      <th className="pb-3">Situação</th>
                      <th className="pb-3 pr-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F1EE]">
                    {clientInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#F9F9F8]">
                        <td className="py-3 pl-2 font-mono font-semibold text-[#101010]">
                          {inv.receiptNumber}
                        </td>
                        <td className="py-3 font-medium text-[#222222]">{inv.serviceTitle}</td>
                        <td className="py-3 font-mono text-[#555555]">{inv.dueDate}</td>
                        <td className="py-3 font-mono font-bold text-[#101010]">
                          R$ {inv.amount.toFixed(2)}
                        </td>
                        <td className="py-3 font-mono text-[#15803D]">
                          R$ {inv.amountPaid.toFixed(2)}
                        </td>
                        <td className="py-3 font-mono font-bold text-[#DC2626]">
                          R$ {inv.balanceDue.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'Pago'
                                ? 'bg-[#F0FDF4] text-[#15803D]'
                                : inv.status === 'Parcial'
                                ? 'bg-[#FFFBEB] text-[#B45309]'
                                : 'bg-[#FEF2F2] text-[#DC2626]'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          {inv.balanceDue > 0 ? (
                            <button
                              onClick={() => openRegisterPayment(inv)}
                              className="rounded-md bg-[#15803D] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#166534]"
                            >
                              Baixar
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#15803D] font-bold">Liquidado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: Tutor list table with search & filters
  return (
    <div className="space-y-6">
      {/* Header & Search Toolbar */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar por nome do tutor, telefone ou CPF..."
            className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] py-2 pl-9 pr-4 text-xs text-[#222222] placeholder-[#999999] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Filter buttons and New Client */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl bg-[#F6F6F4] p-1 border border-[#E9E9E6]">
            <button
              onClick={() => setFinancialFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                financialFilter === 'all'
                  ? 'bg-white text-[#101010] shadow-xs'
                  : 'text-[#777777] hover:text-[#101010]'
              }`}
            >
              Todos ({clients.length})
            </button>
            <button
              onClick={() => setFinancialFilter('pendente')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                financialFilter === 'pendente'
                  ? 'bg-white text-[#DC2626] shadow-xs'
                  : 'text-[#777777] hover:text-[#DC2626]'
              }`}
            >
              Com Pendência
            </button>
            <button
              onClick={() => setFinancialFilter('em_dia')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                financialFilter === 'em_dia'
                  ? 'bg-white text-[#15803D] shadow-xs'
                  : 'text-[#777777] hover:text-[#15803D]'
              }`}
            >
              Em Dia
            </button>
          </div>

          <button
            onClick={() => openNewClient()}
            className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>NOVO CLIENTE</span>
          </button>
        </div>
      </div>

      {/* Clients Management Table */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                <th className="pb-3 pl-2">Cliente (Tutor)</th>
                <th className="pb-3">Contato & WhatsApp</th>
                <th className="pb-3">Animais Vinculados</th>
                <th className="pb-3">Bairro / Cidade</th>
                <th className="pb-3">Último Atendimento</th>
                <th className="pb-3">Total em Aberto</th>
                <th className="pb-3">Situação</th>
                <th className="pb-3 pr-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1EE]">
              {filteredClients.map((client) => {
                const clientPets = getPetsByClientId(client.id);
                const clientInvoices = getInvoicesByClientId(client.id);
                const totalDue = clientInvoices.reduce((acc, curr) => acc + curr.balanceDue, 0);

                const clientApts = getAppointmentsByClientId(client.id);
                const lastApt = clientApts.length > 0 ? clientApts[0].date : 'Nenhum';

                return (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className="hover:bg-[#F9F9F8] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#101010] text-[#FFC400] font-bold text-xs">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-[#101010] block group-hover:text-[#B45309] transition-colors">
                            {client.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#777777]">{client.cpf}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#222222]">{client.phone}</span>
                        <a
                          href={`https://wa.me/${client.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded p-1 text-[#25D366] hover:bg-[#EBFBF0]"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {clientPets.map((p) => (
                          <span
                            key={p.id}
                            className="inline-flex items-center gap-1 rounded-md bg-[#FAF9F5] border border-[#E9E9E6] px-2 py-0.5 text-[11px] font-semibold text-[#101010]"
                          >
                            <Dog className="h-3 w-3 text-[#FFC400]" />
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 text-[#555555]">
                      <span>{client.address.neighborhood}, {client.address.city}</span>
                    </td>

                    <td className="py-4 font-mono text-[#555555]">
                      {lastApt}
                    </td>

                    <td className="py-4 font-mono font-bold">
                      <span className={totalDue > 0 ? 'text-[#DC2626]' : 'text-[#15803D]'}>
                        R$ {totalDue.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          totalDue > 0
                            ? 'bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#F0FDF4] text-[#15803D]'
                        }`}
                      >
                        {totalDue > 0 ? 'Pendente' : 'Em Dia'}
                      </span>
                    </td>

                    <td className="py-4 pr-2 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClientId(client.id);
                        }}
                        className="rounded-lg border border-[#E9E9E6] px-3 py-1.5 text-xs font-semibold text-[#101010] hover:bg-[#101010] hover:text-white transition-all"
                      >
                        Ver Perfil
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
