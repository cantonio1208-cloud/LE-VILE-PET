/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CircleDollarSign,
  TrendingUp,
  AlertCircle,
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Receipt,
  MessageCircle,
  Printer,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, PaymentMethod, PaymentStatus } from '../../types';

export const FinancialScreen: React.FC = () => {
  const {
    invoices,
    getClientById,
    getPetById,
    openRegisterPayment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'geral' | 'a_receber' | 'recebidos' | 'inadimplencia'>('a_receber');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  // 4 Main Key Indicators
  const totalReceived = invoices.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalToReceive = invoices
    .filter((i) => i.status === 'Pendente' || i.status === 'Parcial')
    .reduce((acc, curr) => acc + curr.balanceDue, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === 'Vencido')
    .reduce((acc, curr) => acc + curr.balanceDue, 0);
  const monthlyRevenue = totalReceived + 14850.0; // Adding base month-to-date baseline

  // Filtered lists
  const filteredInvoices = invoices.filter((inv) => {
    const client = getClientById(inv.clientId);
    const pet = getPetById(inv.petId);

    const matchesSearch =
      inv.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (paymentMethodFilter !== 'all' && inv.paymentMethod !== paymentMethodFilter) return false;

    if (activeTab === 'a_receber') {
      return inv.status === 'Pendente' || inv.status === 'Parcial' || inv.status === 'Vencido';
    }
    if (activeTab === 'recebidos') {
      return inv.amountPaid > 0;
    }
    if (activeTab === 'inadimplencia') {
      return inv.status === 'Vencido';
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Register Payment Button */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Controle de Caixa & Contas
          </span>
          <h2 className="text-xl font-bold text-[#101010]">Gestão Financeira Profissional</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-white px-3.5 py-2 text-xs font-semibold text-[#555555] hover:bg-[#F6F6F4]"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir Relatório</span>
          </button>

          <button
            onClick={() => openRegisterPayment()}
            className="flex items-center gap-2 rounded-xl bg-[#15803D] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#166534] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>REGISTRAR PAGAMENTO</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Recebido */}
        <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#15803D] mb-2">
            <span className="text-xs font-bold">Total Recebido</span>
            <ArrowDownLeft className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#15803D]">R$</span>
            <span className="text-2xl font-extrabold text-[#15803D] tabular-nums font-mono">
              {totalReceived.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-[#166534] mt-2 block font-medium">
            Entradas liquidadas no caixa
          </span>
        </div>

        {/* KPI 2: Total a Receber */}
        <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#B45309] mb-2">
            <span className="text-xs font-bold">Total a Receber</span>
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#B45309]">R$</span>
            <span className="text-2xl font-extrabold text-[#B45309] tabular-nums font-mono">
              {totalToReceive.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-[#92400E] mt-2 block font-medium">
            Faturas em aberto ou parciais
          </span>
        </div>

        {/* KPI 3: Total Vencido */}
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#DC2626] mb-2">
            <span className="text-xs font-bold">Total Vencido</span>
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#DC2626]">R$</span>
            <span className="text-2xl font-extrabold text-[#DC2626] tabular-nums font-mono">
              {totalOverdue.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-[#991B1B] mt-2 block font-medium">
            Clientes em atraso (inadimplência)
          </span>
        </div>

        {/* KPI 4: Faturamento do Mês */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#777777] mb-2">
            <span className="text-xs font-bold text-[#101010]">Faturamento do Mês</span>
            <TrendingUp className="h-4 w-4 text-[#FFC400]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#777777]">R$</span>
            <span className="text-2xl font-extrabold text-[#101010] tabular-nums font-mono">
              {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[11px] text-[#15803D] mt-2 block font-bold">
            +18.4% acima da média operacional
          </span>
        </div>
      </div>

      {/* Tabs and Search Filter Bar */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E9E9E6] pb-4">
          {/* 4 Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('geral')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'geral'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              1. Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('a_receber')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'a_receber'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              2. Contas a Receber ({invoices.filter((i) => i.balanceDue > 0).length})
            </button>

            <button
              onClick={() => setActiveTab('recebidos')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'recebidos'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              3. Pagamentos Recebidos
            </button>

            <button
              onClick={() => setActiveTab('inadimplencia')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'inadimplencia'
                  ? 'bg-[#DC2626] text-white'
                  : 'text-[#DC2626] hover:bg-[#FEF2F2]'
              }`}
            >
              4. Inadimplência ({invoices.filter((i) => i.status === 'Vencido').length})
            </button>
          </div>

          {/* Search & Method Filter */}
          <div className="flex items-center gap-3">
            <div className="relative w-56 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente, pet ou recibo..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] py-1.5 pl-8 pr-3 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-1.5 text-xs text-[#222222]"
            >
              <option value="all">Todas as Formas</option>
              <option value="PIX">PIX</option>
              <option value="Cartão de crédito">Cartão de Crédito</option>
              <option value="Cartão de débito">Cartão de Débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferência">Transferência</option>
            </select>
          </div>
        </div>

        {/* TAB 1: VISÃO GERAL */}
        {activeTab === 'geral' && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Formas de Pagamento Breakdown */}
              <div className="p-4 rounded-xl border border-[#E9E9E6] bg-[#FAF9F8] space-y-3">
                <span className="font-bold text-xs text-[#101010] block">
                  Distribuição por Forma de Pagamento
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>PIX Instantâneo</span>
                    <span className="font-mono font-bold text-[#101010]">58% (R$ 18.096)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E9E9E6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFC400]" style={{ width: '58%' }} />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span>Cartão de Crédito</span>
                    <span className="font-mono font-bold text-[#101010]">27% (R$ 8.424)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E9E9E6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#101010]" style={{ width: '27%' }} />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span>Cartão de Débito & Dinheiro</span>
                    <span className="font-mono font-bold text-[#101010]">15% (R$ 4.680)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E9E9E6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#777777]" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>

              {/* Ticket Médio */}
              <div className="p-4 rounded-xl border border-[#E9E9E6] bg-[#FAF9F8] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-xs text-[#101010] block mb-1">
                    Ticket Médio por Atendimento
                  </span>
                  <p className="text-[11px] text-[#777777]">
                    Média de consumo incluindo serviços adicionais e transporte
                  </p>
                </div>
                <div className="pt-4">
                  <span className="text-3xl font-extrabold font-mono text-[#101010]">R$ 138,50</span>
                  <span className="text-[11px] text-[#15803D] block font-semibold mt-1">
                    +12% comparado ao trimestre anterior
                  </span>
                </div>
              </div>

              {/* Chaves PIX Oficiais */}
              <div className="p-4 rounded-xl border border-[#E9E9E6] bg-[#FAF9F8] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-xs text-[#101010] block mb-1">
                    Dados Bancários Oficiais Le Ville Pet
                  </span>
                  <p className="text-[11px] text-[#777777]">
                    Chave PIX e dados exibidos nos comprovantes
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E9E9E6] text-xs font-mono space-y-1">
                  <div>Chave CNPJ: <strong>48.912.842/0001-90</strong></div>
                  <div>Banco: <strong>Itaú Unibanco (341)</strong></div>
                  <div>Favorecido: <strong>Le Ville Pet Ltda</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTAS A RECEBER / TAB 3: RECEBIDOS / TAB 4: INADIMPLÊNCIA */}
        {activeTab !== 'geral' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                  <th className="pb-3 pl-2">Cliente (Tutor)</th>
                  <th className="pb-3">Animal (Pet)</th>
                  <th className="pb-3">Serviço Realizado</th>
                  <th className="pb-3">Data Atend.</th>
                  <th className="pb-3">Vencimento</th>
                  <th className="pb-3">Valor Total</th>
                  <th className="pb-3">Valor Pago</th>
                  <th className="pb-3 font-bold text-[#DC2626]">Saldo Restante</th>
                  <th className="pb-3">Forma</th>
                  <th className="pb-3">Situação</th>
                  <th className="pb-3 pr-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EE]">
                {filteredInvoices.map((inv) => {
                  const client = getClientById(inv.clientId);
                  const pet = getPetById(inv.petId);

                  return (
                    <tr key={inv.id} className="hover:bg-[#F9F9F8] transition-colors">
                      <td className="py-3.5 pl-2">
                        <span className="font-bold text-[#101010] block">{client?.name}</span>
                        <span className="text-[11px] text-[#777777]">{client?.phone}</span>
                      </td>

                      <td className="py-3.5">
                        <span className="font-semibold text-[#101010] block">{pet?.name}</span>
                        <span className="text-[11px] text-[#777777]">{pet?.breed}</span>
                      </td>

                      <td className="py-3.5 text-[#555555] max-w-[200px]">
                        <span className="font-medium text-[#222222] block truncate">
                          {inv.serviceTitle}
                        </span>
                        <span className="text-[10px] text-[#888888] font-mono">{inv.receiptNumber}</span>
                      </td>

                      <td className="py-3.5 font-mono text-[#555555]">
                        {inv.invoiceDate}
                      </td>

                      <td className="py-3.5 font-mono text-[#555555]">
                        {inv.dueDate}
                      </td>

                      <td className="py-3.5 font-mono font-bold text-[#101010]">
                        R$ {inv.amount.toFixed(2)}
                      </td>

                      <td className="py-3.5 font-mono text-[#15803D] font-semibold">
                        R$ {inv.amountPaid.toFixed(2)}
                      </td>

                      <td className="py-3.5 font-mono font-extrabold text-[#DC2626]">
                        {inv.balanceDue > 0 ? `R$ ${inv.balanceDue.toFixed(2)}` : 'R$ 0,00'}
                      </td>

                      <td className="py-3.5 font-medium text-[#555555]">
                        {inv.paymentMethod}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
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

                      <td className="py-3.5 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.balanceDue > 0 && (
                            <button
                              onClick={() => openRegisterPayment(inv)}
                              className="rounded-md bg-[#15803D] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#166534] transition-all"
                            >
                              Baixar
                            </button>
                          )}

                          {inv.status === 'Vencido' && client && (
                            <a
                              href={`https://wa.me/${client.whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(
                                client.name
                              )},%20tudo%20bem%3F%20Passando%20da%20Le%20Ville%20Pet%20para%20enviar%20a%20fatura%20pendente%20de%20R$%20${inv.balanceDue.toFixed(
                                2
                              )}%20referente%20ao%20atendimento%20de%20${encodeURIComponent(
                                pet?.name || ''
                              )}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md bg-[#25D366] text-white hover:bg-[#20BD5A]"
                              title="Cobrança amigável via WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
