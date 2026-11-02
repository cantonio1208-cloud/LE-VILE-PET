/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Screens
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AgendaScreen } from './components/screens/AgendaScreen';
import { ClientsScreen } from './components/screens/ClientsScreen';
import { PetsScreen } from './components/screens/PetsScreen';
import { ServicesScreen } from './components/screens/ServicesScreen';
import { HotelDaycareScreen } from './components/screens/HotelDaycareScreen';
import { TransportScreen } from './components/screens/TransportScreen';
import { FinancialScreen } from './components/screens/FinancialScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { TeamScreen } from './components/screens/TeamScreen';

// Modals
import { NewAppointmentModal } from './components/modals/NewAppointmentModal';
import { NewClientModal } from './components/modals/NewClientModal';
import { NewPetModal } from './components/modals/NewPetModal';
import { RegisterPaymentModal } from './components/modals/RegisterPaymentModal';
import { NewHotelBookingModal } from './components/modals/NewHotelBookingModal';
import { NewServiceModal } from './components/modals/NewServiceModal';
import { AppointmentDetailModal } from './components/modals/AppointmentDetailModal';
import { TeamManagementModal } from './components/modals/TeamManagementModal';

// Icons
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentScreen, toasts, removeToast } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'agenda':
        return <AgendaScreen />;
      case 'clientes':
        return <ClientsScreen />;
      case 'pets':
        return <PetsScreen />;
      case 'servicos':
        return <ServicesScreen />;
      case 'hotel':
        return <HotelDaycareScreen />;
      case 'transporte':
        return <TransportScreen />;
      case 'financeiro':
        return <FinancialScreen />;
      case 'historico':
        return <HistoryScreen />;
      case 'relatorios':
        return <ReportsScreen />;
      case 'configuracoes':
        return <SettingsScreen />;
      case 'equipe':
        return <TeamScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FEFCE8] text-[#222222]">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Viewport Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar Header */}
        <Header onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        {/* Content Body with scroll */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-[1600px] w-full mx-auto">
          {renderScreen()}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lg text-xs font-semibold animate-in slide-in-from-bottom-2 duration-150 ${
              toast.type === 'error'
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                : toast.type === 'warning'
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
                : 'bg-[#101010] border-[#333333] text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-[#B45309]" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FFC400]" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 rounded p-1 text-[#888888] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Global Interactive Modals */}
      <NewAppointmentModal />
      <NewClientModal />
      <NewPetModal />
      <RegisterPaymentModal />
      <NewHotelBookingModal />
      <NewServiceModal />
      <AppointmentDetailModal />
      <TeamManagementModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
