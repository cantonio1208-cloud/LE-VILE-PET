/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Calendar,
  Users,
  Dog,
  CircleDollarSign,
  Home,
  Bell,
  Clock,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';
import { NotificationCenter } from '../notifications/NotificationCenter';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

const screenTitles: Record<ScreenId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Geral', subtitle: 'Visão executiva da operação e saúde financeira' },
  agenda: { title: 'Agenda de Atendimentos', subtitle: 'Controle de banhos, tosas e horários dos profissionais' },
  clientes: { title: 'Gestão de Clientes', subtitle: 'Cadastro de tutores, endereços e histórico de consumo' },
  pets: { title: 'Galeria de Pets', subtitle: 'Fichas cadastrais, fotos, cuidados especiais e histórico clínico' },
  servicos: { title: 'Catálogo de Serviços', subtitle: 'Tabela de preços, durações e pacotes oferecidos' },
  hotel: { title: 'Hotelzinho e Creche', subtitle: 'Ocupação de suítes, check-in, check-out e monitoramento' },
  transporte: { title: 'Logística e Transporte', subtitle: 'Controle de rotas Táxi Dog, coletas e entregas' },
  financeiro: { title: 'Gestão Financeira', subtitle: 'Fluxo de caixa, contas a receber, pendências e recibos' },
  historico: { title: 'Histórico de Atendimentos', subtitle: 'Registro completo de procedimentos realizados' },
  relatorios: { title: 'Relatórios e Métricas', subtitle: 'Análise de faturamento, serviços populares e ocupação' },
  configuracoes: { title: 'Configurações do Sistema', subtitle: 'Dados da unidade, equipe e preferências gerais' },
  equipe: { title: 'Configuração de Equipe & Veterinários', subtitle: 'Cadastro de médicos veterinários com CRMV e profissionais da unidade' },
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currentScreen,
    openNewAppointment,
    openNewClient,
    openNewPet,
    openRegisterPayment,
    openNewHotelBooking,
    openTeamModal,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const screenInfo = screenTitles[currentScreen] || {
    title: 'Painel Le Ville Pet',
    subtitle: 'Gestão Profissional',
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#E9E9E6] bg-white px-4 md:px-8">
      {/* Zone 1: Mobile hamburger + Breadcrumb & Section Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-[#777777] hover:bg-[#F6F6F4] hover:text-[#222222] lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#777777] uppercase">
            <span>Le Ville Pet</span>
            <span className="text-[#CCCCCC]">/</span>
            <span className="text-[#222222]">{screenInfo.title}</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#101010]">
            {screenInfo.title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Global Search & Date display */}
      <div className="hidden md:flex items-center gap-6">
        <div className="relative w-64 lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tutor, pet ou telefone..."
            className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] py-2 pl-9 pr-4 text-xs text-[#222222] placeholder-[#999999] transition-all focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs text-[#777777] font-medium border-l border-[#E9E9E6] pl-6">
          <Clock className="h-4 w-4 text-[#FFC400]" />
          <span>02 de Novembro de 2026</span>
          <span className="text-[#CCCCCC]">·</span>
          <span className="font-mono text-[#222222]">09:19</span>
        </div>
      </div>

      {/* Zone 3: Quick Action Button & Dropdown */}
      <div className="flex items-center gap-3">
        <a
          href="https://levillepet.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#E9E9E6] px-3 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4] transition-colors"
          title="Acessar site institucional"
        >
          <span>levillepet.com.br</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#888888]" />
        </a>

        {/* In-App Notification Center */}
        <NotificationCenter />

        {/* Global Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-lg bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Novo Registro</span>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-56 rounded-xl border border-[#E9E9E6] bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openNewAppointment();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#222222] hover:bg-[#F6F6F4]"
                >
                  <Calendar className="h-4 w-4 text-[#FFC400]" />
                  <span>Novo Agendamento</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openNewClient();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#222222] hover:bg-[#F6F6F4]"
                >
                  <Users className="h-4 w-4 text-[#101010]" />
                  <span>Novo Cliente (Tutor)</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openNewPet();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#222222] hover:bg-[#F6F6F4]"
                >
                  <Dog className="h-4 w-4 text-[#101010]" />
                  <span>Novo Pet</span>
                </button>

                <div className="my-1 border-t border-[#E9E9E6]" />

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openRegisterPayment();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#15803D] hover:bg-[#F0FDF4]"
                >
                  <CircleDollarSign className="h-4 w-4" />
                  <span>Registrar Pagamento</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openNewHotelBooking();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#222222] hover:bg-[#F6F6F4]"
                >
                  <Home className="h-4 w-4 text-[#777777]" />
                  <span>Hospedagem / Creche</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openTeamModal();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#B45309] hover:bg-[#FEF3C7]"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Novo Profissional / CRMV</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
