/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Dog,
  Home,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  Clock,
  ArrowUpRight,
  Plus,
  Scissors,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  CreditCard,
  Truck,
  Bell,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const {
    appointments,
    clients,
    pets,
    hotelBookings,
    invoices,
    getClientById,
    getPetById,
    getServiceById,
    openNewAppointment,
    openNewClient,
    openNewPet,
    openRegisterPayment,
    setSelectedAppointmentId,
    setSelectedClientId,
    setSelectedPetId,
    setCurrentScreen,
    notifications,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
  } = useApp();

  // KPI Calculations
  const today = '2026-11-02';
  const todayAppointments = appointments.filter((a) => a.date === today);
  const inProgressCount = todayAppointments.filter((a) => a.status === 'Em andamento').length;
  const hostedPetsCount = hotelBookings.filter((h) => h.status === 'Hospedado').length;

  const todayRevenue = invoices
    .filter((i) => i.paidAt && i.paidAt.startsWith(today))
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  // November 2026 total revenue
  const monthlyRevenue = invoices
    .filter((i) => i.paidAt && i.paidAt.startsWith('2026-11'))
    .reduce((acc, curr) => acc + curr.amountPaid, 0) + 14850.0;

  const totalToReceive = invoices
    .filter((i) => i.status === 'Pendente' || i.status === 'Parcial')
    .reduce((acc, curr) => acc + curr.balanceDue, 0);

  const totalOverdue = invoices
    .filter((i) => i.status === 'Vencido')
    .reduce((acc, curr) => acc + curr.balanceDue, 0);

  const totalClientsCount = clients.length;

  // Pending payments panel items
  const pendingInvoices = invoices
    .filter((i) => i.status === 'Pendente' || i.status === 'Parcial' || i.status === 'Vencido')
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#15803D]" />
            <span className="text-xs font-semibold text-[#777777] uppercase tracking-wider">
              Painel Operacional Ativo
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#101010]">
            Bom dia! Bem-vindo à Le Ville Pet.
          </h2>
          <p className="text-sm text-[#555555] mt-1">
            Acompanhe a operação e a saúde financeira do seu pet shop em tempo real.
          </p>
        </div>

        {/* Quick Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openNewAppointment()}
            className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2.5 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Novo Agendamento</span>
          </button>
          <button
            onClick={() => openNewClient()}
            className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-[#F6F6F4] px-3.5 py-2.5 text-xs font-semibold text-[#222222] hover:bg-white hover:border-[#CCCCCC] transition-all"
          >
            <Users className="h-4 w-4 text-[#777777]" />
            <span>Novo Cliente</span>
          </button>
          <button
            onClick={() => openNewPet()}
            className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-[#F6F6F4] px-3.5 py-2.5 text-xs font-semibold text-[#222222] hover:bg-white hover:border-[#CCCCCC] transition-all"
          >
            <Dog className="h-4 w-4 text-[#777777]" />
            <span>Novo Pet</span>
          </button>
          <button
            onClick={() => openRegisterPayment()}
            className="flex items-center gap-1.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-2.5 text-xs font-bold text-[#15803D] hover:bg-[#DCFCE7] transition-all"
          >
            <CreditCard className="h-4 w-4" />
            <span>Registrar Pagamento</span>
          </button>
        </div>
      </div>

      {/* Operational Notifications & Alerts Quick Banner */}
      {unreadNotificationsCount > 0 && (
        <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFC400] text-[#101010] shadow-xs">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                  Avisos e Pendências Operacionais
                </span>
                <span className="rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                  {unreadNotificationsCount} alerta{unreadNotificationsCount > 1 ? 's' : ''} não lido{unreadNotificationsCount > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-[#78350F] mt-0.5">
                Há agendamentos para hoje, doses de vacinas com pendência/vencimento e faturas atrasadas aguardando quitação.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setIsNotificationCenterOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#101010] px-4 py-2 text-xs font-bold text-white hover:bg-[#333333] active:scale-95 transition-all shadow-xs"
            >
              <Bell className="h-3.5 w-3.5 text-[#FFC400]" />
              <span>Abrir Notificações</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 8 Main KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Agendamentos de Hoje */}
        <div
          onClick={() => setCurrentScreen('agenda')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#FFC400] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Agendamentos Hoje</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF9F5] text-[#101010] group-hover:bg-[#FFC400]">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#101010] tabular-nums font-mono">
              {todayAppointments.length}
            </span>
            <span className="text-xs text-[#777777]">atendimentos</span>
          </div>
          <div className="mt-2 text-[11px] text-[#15803D] font-medium flex items-center gap-1">
            <span>● 100% da grade confirmada</span>
          </div>
        </div>

        {/* Card 2: Pets em Atendimento */}
        <div
          onClick={() => setCurrentScreen('agenda')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#FFC400] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Pets em Atendimento</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF9F5] text-[#101010] group-hover:bg-[#FFC400]">
              <Scissors className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#101010] tabular-nums font-mono">
              {inProgressCount}
            </span>
            <span className="text-xs text-[#777777]">no banho / tosa</span>
          </div>
          <div className="mt-2 text-[11px] text-[#B45309] font-medium">
            Mesa 01 e Banheira 02 ativas
          </div>
        </div>

        {/* Card 3: Pets Hospedados */}
        <div
          onClick={() => setCurrentScreen('hotel')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#FFC400] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Pets Hospedados</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF9F5] text-[#101010] group-hover:bg-[#FFC400]">
              <Home className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#101010] tabular-nums font-mono">
              {hostedPetsCount}
            </span>
            <span className="text-xs text-[#777777]">em hotel / creche</span>
          </div>
          <div className="mt-2 text-[11px] text-[#777777]">
            Suítes ocupadas: 3 de 5
          </div>
        </div>

        {/* Card 4: Total de Clientes */}
        <div
          onClick={() => setCurrentScreen('clientes')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#FFC400] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Total de Clientes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF9F5] text-[#101010] group-hover:bg-[#FFC400]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#101010] tabular-nums font-mono">
              {totalClientsCount}
            </span>
            <span className="text-xs text-[#777777]">tutores ({pets.length} pets)</span>
          </div>
          <div className="mt-2 text-[11px] text-[#15803D] font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+12 novos este mês</span>
          </div>
        </div>

        {/* Card 5: Faturamento do Dia */}
        <div
          onClick={() => setCurrentScreen('financeiro')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#FFC400] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Faturamento do Dia</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#15803D]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#777777]">R$</span>
            <span className="text-2xl font-extrabold text-[#15803D] tabular-nums font-mono">
              {todayRevenue.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#777777]">
            Entradas via PIX e Cartões
          </div>
        </div>

        {/* Card 6: Faturamento Mensal */}
        <div
          onClick={() => setCurrentScreen('financeiro')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#FFC400] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Faturamento Mensal</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF9F5] text-[#101010] group-hover:bg-[#FFC400]">
              <TrendingUp className="h-4 w-4 text-[#101010]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#777777]">R$</span>
            <span className="text-2xl font-extrabold text-[#101010] tabular-nums font-mono">
              {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#15803D] font-medium flex items-center gap-1">
            <span>Meta atingida em 111%</span>
          </div>
        </div>

        {/* Card 7: Total a Receber */}
        <div
          onClick={() => setCurrentScreen('financeiro')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#FFC400] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Total a Receber</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFFBEB] text-[#B45309]">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#777777]">R$</span>
            <span className="text-2xl font-extrabold text-[#B45309] tabular-nums font-mono">
              {totalToReceive.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#777777]">
            Faturas em aberto / parciais
          </div>
        </div>

        {/* Card 8: Valores Vencidos */}
        <div
          onClick={() => setCurrentScreen('financeiro')}
          className="cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs hover:border-[#DC2626] transition-all group"
        >
          <div className="flex items-center justify-between text-[#777777] mb-3">
            <span className="text-xs font-medium">Valores Vencidos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#DC2626]">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#777777]">R$</span>
            <span className="text-2xl font-extrabold text-[#DC2626] tabular-nums font-mono">
              {totalOverdue.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#DC2626] font-medium flex items-center gap-1">
            <span>Ação de cobrança necessária</span>
          </div>
        </div>
      </div>

      {/* Main Operational Split: Agenda do Dia & Finance/Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide): Agenda do Dia */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E9E9E6]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                  Cronograma Operacional
                </span>
                <h3 className="text-lg font-bold text-[#101010]">Agenda de Atendimentos de Hoje</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#777777] hidden sm:inline">02 de Novembro</span>
                <button
                  onClick={() => setCurrentScreen('agenda')}
                  className="flex items-center gap-1 rounded-lg border border-[#E9E9E6] px-3 py-1.5 text-xs font-semibold text-[#101010] hover:bg-[#F6F6F4]"
                >
                  <span>Ver Agenda Completa</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Table / List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                    <th className="pb-3 pl-2">Horário</th>
                    <th className="pb-3">Animal (Pet)</th>
                    <th className="pb-3">Tutor</th>
                    <th className="pb-3">Serviço</th>
                    <th className="pb-3">Profissional</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F1EE]">
                  {todayAppointments.map((apt) => {
                    const client = getClientById(apt.clientId);
                    const pet = getPetById(apt.petId);
                    const service = getServiceById(apt.serviceId);

                    return (
                      <tr
                        key={apt.id}
                        className="hover:bg-[#F9F9F8] transition-colors cursor-pointer"
                        onClick={() => setSelectedAppointmentId(apt.id)}
                      >
                        <td className="py-3.5 pl-2 font-mono font-bold text-[#101010]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#FFC400]" />
                            <span>{apt.time}</span>
                          </div>
                        </td>

                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&q=80'}
                              alt={pet?.name}
                              className="h-9 w-9 rounded-lg object-cover border border-[#E9E9E6]"
                            />
                            <div>
                              <span className="font-bold text-[#101010] block">{pet?.name}</span>
                              <span className="text-[11px] text-[#777777]">{pet?.breed}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5">
                          <span className="font-medium text-[#222222] block">{client?.name}</span>
                          <span className="text-[11px] text-[#777777]">{client?.phone}</span>
                        </td>

                        <td className="py-3.5">
                          <span className="font-medium text-[#101010] block">
                            {service?.name || 'Serviço'}
                          </span>
                          {apt.transport?.enabled && (
                            <span className="text-[10px] text-[#B45309] font-medium flex items-center gap-1">
                              <Truck className="h-3 w-3" /> Leva e Traz ({apt.transport.status})
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 text-[#555555]">
                          <span>{apt.staffName}</span>
                        </td>

                        <td className="py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
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
                            className="rounded-md border border-[#E9E9E6] px-2.5 py-1 text-[11px] font-semibold text-[#555555] hover:bg-[#101010] hover:text-white transition-all"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9E9E6] flex items-center justify-between text-xs text-[#777777]">
            <span>Exibindo <strong>{todayAppointments.length}</strong> atendimentos agendados para hoje</span>
            <button
              onClick={() => openNewAppointment()}
              className="text-xs font-bold text-[#101010] underline hover:text-[#B45309]"
            >
              + Encaixar Atendimento
            </button>
          </div>
        </div>

        {/* Right Column (1 col): Pending Payments & Today's Logistics */}
        <div className="space-y-6">
          {/* Pending Payments Panel */}
          <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E9E9E6]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                  Controle de Recebimentos
                </span>
                <h4 className="text-sm font-bold text-[#101010]">Pagamentos Pendentes</h4>
              </div>
              <button
                onClick={() => openRegisterPayment()}
                className="text-xs font-bold text-[#15803D] hover:underline"
              >
                + Baixar
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingInvoices.map((inv) => {
                const client = getClientById(inv.clientId);
                const pet = getPetById(inv.petId);

                return (
                  <div
                    key={inv.id}
                    className="p-2.5 rounded-xl border border-[#E9E9E6] bg-[#FBFBFA] flex items-center justify-between hover:bg-white hover:border-[#CCCCCC] transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#101010]">{client?.name}</span>
                        <span className="text-[11px] text-[#777777]">({pet?.name})</span>
                      </div>
                      <span className="text-[11px] text-[#777777] block truncate max-w-[160px]">
                        {inv.serviceTitle}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#DC2626] block">
                        R$ {inv.balanceDue.toFixed(2)}
                      </span>
                      <button
                        onClick={() => openRegisterPayment(inv)}
                        className="text-[10px] font-bold text-[#15803D] underline hover:text-[#166534]"
                      >
                        Pagar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-[#E9E9E6] text-center">
              <button
                onClick={() => setCurrentScreen('financeiro')}
                className="text-xs font-semibold text-[#555555] hover:text-[#101010]"
              >
                Gerenciar todas as contas a receber →
              </button>
            </div>
          </div>

          {/* Today's Logistics Overview Panel */}
          <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E9E9E6]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                  Logística & Transporte
                </span>
                <h4 className="text-sm font-bold text-[#101010]">Rotas de Hoje (Táxi Dog)</h4>
              </div>
              <button
                onClick={() => setCurrentScreen('transporte')}
                className="text-xs font-bold text-[#101010] hover:underline"
              >
                Ver rotas →
              </button>
            </div>

            <div className="space-y-2.5">
              {todayAppointments
                .filter((a) => a.transport?.enabled)
                .slice(0, 3)
                .map((apt) => {
                  const client = getClientById(apt.clientId);
                  const pet = getPetById(apt.petId);

                  return (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAppointmentId(apt.id)}
                      className="p-2.5 rounded-xl border border-[#E9E9E6] bg-[#FBFBFA] flex items-center justify-between hover:bg-white hover:border-[#CCCCCC] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF9F5] text-[#101010] border border-[#E9E9E6]">
                          <Truck className="h-4 w-4 text-[#FFC400]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#101010]">{pet?.name}</span>
                            <span className="text-[11px] text-[#777777]">({client?.name})</span>
                          </div>
                          <span className="text-[10px] text-[#777777] block truncate max-w-[170px]">
                            {apt.transport?.address}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-[11px] font-bold text-[#101010] block">
                          {apt.transport?.pickupTime || apt.time}
                        </span>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            apt.transport?.status === 'Entregue'
                              ? 'bg-[#F0FDF4] text-[#15803D]'
                              : apt.transport?.status === 'Pet recolhido'
                              ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                              : 'bg-[#FFFBEB] text-[#B45309]'
                          }`}
                        >
                          {apt.transport?.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-3 pt-2 border-t border-[#E9E9E6] text-center">
              <button
                onClick={() => setCurrentScreen('transporte')}
                className="text-xs font-semibold text-[#555555] hover:text-[#101010]"
              >
                Acompanhar motorista em tempo real →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
