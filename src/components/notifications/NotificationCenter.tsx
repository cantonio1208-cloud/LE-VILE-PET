/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Calendar,
  Clock,
  AlertTriangle,
  ShieldAlert,
  CircleDollarSign,
  ChevronRight,
  CheckCircle2,
  Syringe,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification, NotificationType } from '../../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    clearAllNotifications,
    handleNotificationAction,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'todas' | NotificationType>('todas');
  const [filterOnlyUnread, setFilterOnlyUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationCenterOpen(false);
      }
    }

    if (isNotificationCenterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationCenterOpen, setIsNotificationCenterOpen]);

  // Filter list
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab !== 'todas' && notif.type !== activeTab) {
      return false;
    }
    if (filterOnlyUnread && notif.read) {
      return false;
    }
    return true;
  });

  // Type counts
  const countAppointments = notifications.filter((n) => n.type === 'agendamento').length;
  const countVaccines = notifications.filter((n) => n.type === 'vacina').length;
  const countPayments = notifications.filter((n) => n.type === 'pagamento').length;

  const getNotificationIcon = (notif: AppNotification) => {
    switch (notif.type) {
      case 'agendamento':
        return <Calendar className="h-4 w-4 text-[#B45309]" />;
      case 'vacina':
        return notif.severity === 'urgente' ? (
          <ShieldAlert className="h-4 w-4 text-[#DC2626]" />
        ) : (
          <Syringe className="h-4 w-4 text-[#D97706]" />
        );
      case 'pagamento':
        return <CircleDollarSign className="h-4 w-4 text-[#DC2626]" />;
      default:
        return <Bell className="h-4 w-4 text-[#777777]" />;
    }
  };

  const getBadgeStyle = (notif: AppNotification) => {
    switch (notif.type) {
      case 'agendamento':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'vacina':
        return notif.severity === 'urgente'
          ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
          : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      case 'pagamento':
        return 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
      default:
        return 'bg-[#F6F6F4] text-[#555555] border-[#E9E9E6]';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
        className="relative flex items-center justify-center rounded-lg border border-[#E9E9E6] bg-white p-2 text-[#555555] hover:bg-[#F6F6F4] hover:text-[#101010] active:scale-95 transition-all"
        title="Central de Notificações & Alertas"
        aria-label="Notificações"
      >
        <Bell className="h-4 w-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Flyout Dropdown Modal */}
      {isNotificationCenterOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[360px] sm:w-[420px] md:w-[480px] rounded-2xl border border-[#E9E9E6] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          {/* Header */}
          <div className="border-b border-[#E9E9E6] bg-[#FCFCFA] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFC400] text-[#101010]">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101010] flex items-center gap-2">
                    <span>Central de Notificações</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-semibold text-[#DC2626] border border-[#FECACA]">
                        {unreadNotificationsCount} pendente{unreadNotificationsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-[#777777]">
                    Alertas operacionais, vacinas e pendências financeiras
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNotificationCenterOpen(false)}
                className="rounded-lg p-1.5 text-[#888888] hover:bg-[#F6F6F4] hover:text-[#222222] transition-colors"
                title="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Actions Header */}
            {notifications.length > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-[#E9E9E6] pt-2 text-xs">
                <button
                  onClick={markAllNotificationsAsRead}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-[#555555] hover:text-[#101010] transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-[#15803D]" />
                  <span>Marcar todas como lidas</span>
                </button>

                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-[#777777] hover:text-[#DC2626] transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Limpar todas</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-[#E9E9E6] bg-white px-3 py-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('todas')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all text-xs whitespace-nowrap ${
                activeTab === 'todas'
                  ? 'bg-[#101010] text-white shadow-xs'
                  : 'text-[#666666] hover:bg-[#F6F6F4] hover:text-[#222222]'
              }`}
            >
              <span>Todas</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === 'todas' ? 'bg-[#333333] text-white' : 'bg-[#E9E9E6] text-[#666666]'
              }`}>
                {notifications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('agendamento')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all text-xs whitespace-nowrap ${
                activeTab === 'agendamento'
                  ? 'bg-[#B45309] text-white shadow-xs'
                  : 'text-[#666666] hover:bg-[#FEF3C7] hover:text-[#92400E]'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Agendamentos</span>
              {countAppointments > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === 'agendamento' ? 'bg-[#92400E] text-white' : 'bg-[#FEF3C7] text-[#92400E]'
                }`}>
                  {countAppointments}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('vacina')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all text-xs whitespace-nowrap ${
                activeTab === 'vacina'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'text-[#666666] hover:bg-[#FEF2F2] hover:text-[#DC2626]'
              }`}
            >
              <Syringe className="h-3.5 w-3.5" />
              <span>Vacinas</span>
              {countVaccines > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === 'vacina' ? 'bg-[#991B1B] text-white' : 'bg-[#FEF2F2] text-[#991B1B]'
                }`}>
                  {countVaccines}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pagamento')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all text-xs whitespace-nowrap ${
                activeTab === 'pagamento'
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'text-[#666666] hover:bg-[#F0FDF4] hover:text-[#15803D]'
              }`}
            >
              <CircleDollarSign className="h-3.5 w-3.5" />
              <span>Financeiro</span>
              {countPayments > 0 && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === 'pagamento' ? 'bg-[#166534] text-white' : 'bg-[#F0FDF4] text-[#166534]'
                }`}>
                  {countPayments}
                </span>
              )}
            </button>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E9E9E6]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0FDF4] text-[#15803D] mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-[#101010]">Tudo em dia!</h4>
                <p className="mt-1 text-xs text-[#777777] max-w-xs">
                  {activeTab === 'todas'
                    ? 'Nenhum alerta pendente no momento para a sua operação.'
                    : `Não há alertas pendentes na categoria selecionada.`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`group relative p-4 transition-colors hover:bg-[#FBFBFA] ${
                    !notif.read ? 'bg-[#FFFDF5]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Category Icon Badge */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${getBadgeStyle(
                        notif
                      )}`}
                    >
                      {getNotificationIcon(notif)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <span
                              className="h-2 w-2 rounded-full bg-[#FFC400]"
                              title="Não lida"
                            />
                          )}
                          <h4
                            className={`text-xs font-bold truncate ${
                              notif.severity === 'urgente'
                                ? 'text-[#DC2626]'
                                : 'text-[#101010]'
                            }`}
                          >
                            {notif.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-[#888888] shrink-0 font-medium">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#555555] leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      {/* Quick Action Button & Options */}
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        {notif.actionLabel && (
                          <button
                            onClick={() => handleNotificationAction(notif)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#101010] px-3 py-1.5 text-[11px] font-bold text-white shadow-2xs hover:bg-[#333333] active:scale-95 transition-all"
                          >
                            <span>{notif.actionLabel}</span>
                            <ChevronRight className="h-3 w-3 text-[#FFC400]" />
                          </button>
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="rounded-md p-1.5 text-[#888888] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
                              title="Marcar como lida"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => dismissNotification(notif.id)}
                            className="rounded-md p-1.5 text-[#888888] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                            title="Remover alerta"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#E9E9E6] bg-[#FCFCFA] px-4 py-2.5 flex items-center justify-between text-[11px] text-[#777777]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#15803D]" />
              Monitoramento Ativo (02/11/2026)
            </span>
            <span>Le Ville Pet Gestão</span>
          </div>
        </div>
      )}
    </div>
  );
};
