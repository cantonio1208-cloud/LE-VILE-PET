/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Users,
  Dog,
  Scissors,
  Home,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsScreen: React.FC = () => {
  const { clients, pets, appointments, invoices, hotelBookings, managerProfile, showToast } = useApp();

  const [reportPeriod, setReportPeriod] = useState<'semestre' | 'ano'>('semestre');

  const handlePrint = () => {
    showToast('Preparando relatório executivo para impressão / exportação em PDF...', 'info');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Services ranking
  const topServices = [
    { name: 'Banho Ozonizado Le Ville Prime', count: 142, revenue: 15620, pct: 36 },
    { name: 'Banho & Tosa da Raça (Tesoura)', count: 98, revenue: 15190, pct: 35 },
    { name: 'Diária de Hotelzinho VIP', count: 48, revenue: 6720, pct: 15 },
    { name: 'Banho Hidratante Simples', count: 85, revenue: 5525, pct: 12 },
    { name: 'Serviço de Transporte Táxi Dog', count: 110, revenue: 4400, pct: 10 },
  ];

  // Frequent Clients
  const frequentClients = [
    { name: 'Mariana Oliveira', petsCount: 2, visits: 24, totalSpent: 3480, status: 'VIP' },
    { name: 'Carlos Eduardo Mendes', petsCount: 1, visits: 18, totalSpent: 2240, status: 'Frequente' },
    { name: 'Beatriz Silveira', petsCount: 2, visits: 16, totalSpent: 2650, status: 'Frequente' },
    { name: 'Roberto Alencar', petsCount: 1, visits: 12, totalSpent: 1890, status: 'Ativo' },
    { name: 'Juliana Fontana', petsCount: 1, visits: 11, totalSpent: 1540, status: 'Ativo' },
  ];

  // Most attended Pets
  const topPets = [
    { name: 'Thor', breed: 'Golden Retriever', tutor: 'Mariana Oliveira', attendances: 14 },
    { name: 'Luna', breed: 'Shih Tzu', tutor: 'Mariana Oliveira', attendances: 10 },
    { name: 'Paçoca', breed: 'Spitz Alemão', tutor: 'Carlos Eduardo', attendances: 9 },
    { name: 'Mel', breed: 'Dachshund', tutor: 'Beatriz Silveira', attendances: 8 },
    { name: 'Frederico', breed: 'Pug', tutor: 'Beatriz Silveira', attendances: 8 },
  ];

  // Hotel occupancy metrics
  const occupancyRate = 72; // 72% current monthly rate

  return (
    <div className="space-y-6">
      {/* Formal Printable Document Header (shown ONLY in Print / PDF export) */}
      <div className="print-only mb-6 border-b-2 border-[#101010] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFC400] text-[#101010] font-extrabold text-2xl">
              LV
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#101010]">
                LE VILLE PET GESTÃO & SPA ANIMAL
              </h1>
              <p className="text-xs text-[#555555]">
                CNPJ: 48.912.842/0001-90 · Unidade Jardim das Américas · Curitiba - PR
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-[#555555]">
            <p className="font-bold text-[#101010]">RELATÓRIO EXECUTIVO GERENCIAL</p>
            <p>Data de Emissão: 02/11/2026</p>
            <p>Responsável: {managerProfile.name} ({managerProfile.role})</p>
          </div>
        </div>
      </div>

      {/* Screen Header and Actions */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Inteligência Gerencial & BI
          </span>
          <h2 className="text-xl font-bold text-[#101010]">Relatórios de Desempenho Operacional</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2.5 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
            title="Exportar relatório completo em PDF"
          >
            <Printer className="h-4 w-4 stroke-[2.5]" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* 3 Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#777777] block mb-1">
            Taxa de Ocupação do Hotelzinho
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#101010]">{occupancyRate}%</span>
            <span className="text-xs text-[#15803D] font-bold">+8% vs mês passado</span>
          </div>
          <div className="w-full bg-[#E9E9E6] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#FFC400] h-full" style={{ width: `${occupancyRate}%` }} />
          </div>
          <span className="text-[11px] text-[#777777] mt-2 block">
            Média de 4.2 diárias por reserva
          </span>
        </div>

        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#777777] block mb-1">
            Fidelização e Retorno de Tutores
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#101010]">88.5%</span>
            <span className="text-xs text-[#15803D] font-bold">Excelente</span>
          </div>
          <div className="w-full bg-[#E9E9E6] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#101010] h-full" style={{ width: '88.5%' }} />
          </div>
          <span className="text-[11px] text-[#777777] mt-2 block">
            Tutores retornam a cada 14 dias em média
          </span>
        </div>

        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#777777] block mb-1">
            Índice de Inadimplência
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#DC2626]">3.1%</span>
            <span className="text-xs text-[#15803D] font-bold">Abaixo do teto seguro (5%)</span>
          </div>
          <div className="w-full bg-[#E9E9E6] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#DC2626] h-full" style={{ width: '3.1%' }} />
          </div>
          <span className="text-[11px] text-[#777777] mt-2 block">
            Rastreamento automático via WhatsApp
          </span>
        </div>
      </div>

      {/* Services Breakdown & Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Ranking */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6]">
            <div>
              <h3 className="text-base font-bold text-[#101010]">Serviços Mais Realizados</h3>
              <p className="text-xs text-[#777777]">Volume de atendimentos e receita gerada</p>
            </div>
            <Scissors className="h-5 w-5 text-[#FFC400]" />
          </div>

          <div className="space-y-4">
            {topServices.map((srv, idx) => (
              <div key={srv.name} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#777777] text-[11px]">0{idx + 1}.</span>
                    <span className="font-semibold text-[#101010]">{srv.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#777777]">{srv.count} sessões</span>
                    <span className="font-mono font-bold text-[#101010]">
                      R$ {srv.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#F6F6F4] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${idx === 0 ? 'bg-[#FFC400]' : 'bg-[#101010]'}`}
                    style={{ width: `${srv.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Attended Pets */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6]">
            <div>
              <h3 className="text-base font-bold text-[#101010]">Animais Mais Atendidos</h3>
              <p className="text-xs text-[#777777]">Top pets com maior frequência no pet shop</p>
            </div>
            <Dog className="h-5 w-5 text-[#FFC400]" />
          </div>

          <div className="divide-y divide-[#F1F1EE]">
            {topPets.map((p, i) => (
              <div key={p.name} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#777777] w-5">0{i + 1}</span>
                  <div>
                    <span className="font-bold text-[#101010] block">{p.name}</span>
                    <span className="text-[11px] text-[#777777]">{p.breed} · Tutor: {p.tutor}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#101010] block">
                    {p.attendances} atendimentos
                  </span>
                  <span className="text-[10px] text-[#15803D] font-bold">Cliente Frequente</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Frequent Clients Table */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6]">
          <div>
            <h3 className="text-base font-bold text-[#101010]">Clientes Mais Frequentes</h3>
            <p className="text-xs text-[#777777]">Tutores com maior engajamento e faturamento acumulado</p>
          </div>
          <Users className="h-5 w-5 text-[#FFC400]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                <th className="pb-3 pl-2">Cliente (Tutor)</th>
                <th className="pb-3">Animais Cadastrados</th>
                <th className="pb-3">Frequência Total</th>
                <th className="pb-3">Faturamento Acumulado</th>
                <th className="pb-3">Classificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1EE]">
              {frequentClients.map((c) => (
                <tr key={c.name} className="hover:bg-[#F9F9F8]">
                  <td className="py-3 pl-2 font-bold text-[#101010]">{c.name}</td>
                  <td className="py-3 font-mono text-[#555555]">{c.petsCount} pets</td>
                  <td className="py-3 font-mono text-[#555555]">{c.visits} visitas</td>
                  <td className="py-3 font-mono font-extrabold text-[#101010]">
                    R$ {c.totalSpent.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="bg-[#FAF9F5] border border-[#FFC400] text-[#101010] font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Printable Document Footer (shown ONLY in Print / PDF export) */}
      <div className="print-only mt-8 border-t border-[#D8D8D4] pt-4 text-center text-[10px] text-[#777777]">
        <p className="font-semibold text-[#101010]">
          Documento emitido eletronicamente pelo Sistema Le Ville Pet Gestão · Relatório confidencial de controle gerencial
        </p>
        <p className="mt-0.5">
          https://levillepet.com.br · Todos os direitos reservados · Unidade Jardim das Américas - Curitiba/PR
        </p>
      </div>
    </div>
  );
};
