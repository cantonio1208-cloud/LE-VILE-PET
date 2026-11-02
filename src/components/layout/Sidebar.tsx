/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Dog,
  Scissors,
  Home,
  Truck,
  CircleDollarSign,
  Clock,
  BarChart3,
  Settings,
  UserCheck,
  ChevronRight,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenId } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentScreen,
    setCurrentScreen,
    setSelectedClientId,
    setSelectedPetId,
    appointments,
    hotelBookings,
    invoices,
    staff,
    managerProfile,
  } = useApp();

  const handleNav = (screen: ScreenId) => {
    setCurrentScreen(screen);
    setSelectedClientId(null);
    setSelectedPetId(null);
    setMobileOpen(false);
  };

  // Badge calculations for operational awareness
  const todayAptsCount = appointments.filter((a) => a.date === '2026-11-02').length;
  const activeHotelCount = hotelBookings.filter((h) => h.status === 'Hospedado').length;
  const overdueCount = invoices.filter((i) => i.status === 'Vencido').length;

  const navItems: {
    id: ScreenId;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeAlert?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar, badge: todayAptsCount },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'pets', label: 'Pets', icon: Dog },
    { id: 'servicos', label: 'Serviços', icon: Scissors },
    { id: 'equipe', label: 'Equipe & Veterinários', icon: UserCheck, badge: staff.length },
    { id: 'hotel', label: 'Hotelzinho e Creche', icon: Home, badge: activeHotelCount },
    { id: 'transporte', label: 'Transporte', icon: Truck, badge: '3 rotas' },
    { id: 'financeiro', label: 'Financeiro', icon: CircleDollarSign, badge: overdueCount ? `${overdueCount} pend` : undefined, badgeAlert: overdueCount > 0 },
    { id: 'historico', label: 'Histórico de Atendimentos', icon: Clock },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#101010] text-[#E9E9E6] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#242424] px-6">
          <div className="flex items-center gap-3">
            {/* Crest Logo */}
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFC400] text-[#101010] shadow-sm">
              <span className="font-extrabold text-xl tracking-tighter">LV</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">LE VILLE PET</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFC400]" />
              </div>
              <span className="text-[11px] font-medium tracking-widest text-[#999999] uppercase">
                Sistema de Gestão
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-800 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Operational Status Pill Banner */}
        <div className="px-5 pt-4 pb-1">
          <div className="flex items-center justify-between rounded-md bg-[#1B1B1B] px-3 py-2 text-xs text-[#A0A0A0]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#15803D]" />
              <span className="font-medium text-white">Loja Aberta</span>
            </div>
            <span className="font-mono text-[11px] text-[#888888]">Jardim das Américas</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1E1E1E] text-white shadow-xs'
                    : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-white'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#FFC400]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-[#FFC400]' : 'text-[#777777] group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeAlert
                        ? 'bg-[#DC2626]/20 text-[#FCA5A5]'
                        : isActive
                        ? 'bg-[#FFC400]/20 text-[#FFC400]'
                        : 'bg-[#262626] text-[#A0A0A0]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer (Gerente Cadastrado no Sistema) */}
        <div className="border-t border-[#242424] bg-[#141414] p-3.5">
          <button
            onClick={() => handleNav('configuracoes')}
            className="group flex w-full items-center justify-between rounded-xl p-1.5 transition-colors hover:bg-[#1C1C1C] text-left"
            title="Clique para ver ou alterar os dados da Gerente em Configurações"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={managerProfile.avatar}
                  alt={managerProfile.name}
                  className="h-10 w-10 rounded-full border border-[#333333] object-cover group-hover:border-[#FFC400] transition-colors"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#141414] bg-[#15803D]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate group-hover:text-[#FFC400] transition-colors">
                  {managerProfile.name}
                </span>
                <span className="text-[11px] text-[#888888] truncate font-medium">
                  {managerProfile.role}
                </span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-[#777777] group-hover:text-white transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
};
