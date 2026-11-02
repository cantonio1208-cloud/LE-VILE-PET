/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Truck,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  Navigation,
  User,
  Dog,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransportStatus } from '../../types';

export const TransportScreen: React.FC = () => {
  const {
    appointments,
    getClientById,
    getPetById,
    updateTransportStatus,
    openNewAppointment,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter appointments with transport enabled
  const transportAppointments = appointments
    .filter((a) => a.transport && a.transport.enabled)
    .sort((a, b) => (a.transport?.pickupTime || a.time).localeCompare(b.transport?.pickupTime || b.time));

  const filteredTransports = transportAppointments.filter((a) => {
    if (filterStatus !== 'all' && a.transport?.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: TransportStatus) => {
    switch (status) {
      case 'Entregue':
        return 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]';
      case 'Pet recolhido':
        return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
      case 'Em rota':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      case 'Pendente':
      default:
        return 'bg-[#F6F6F4] text-[#555555] border-[#E9E9E6]';
    }
  };

  const getNextStatus = (current: TransportStatus): TransportStatus | null => {
    if (current === 'Pendente') return 'Em rota';
    if (current === 'Em rota') return 'Pet recolhido';
    if (current === 'Pet recolhido') return 'Entregue';
    return null;
  };

  const getNextActionLabel = (current: TransportStatus): string => {
    if (current === 'Pendente') return 'Iniciar Rota';
    if (current === 'Em rota') return 'Marcar Pet Recolhido';
    if (current === 'Pet recolhido') return 'Finalizar Entrega';
    return 'Concluído';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Logística & Táxi Dog
          </span>
          <h2 className="text-xl font-bold text-[#101010]">Controle de Coletas e Entregas</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-[#FAF9F5] border border-[#E9E9E6] px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-[#15803D]" />
            <span className="font-semibold text-[#101010]">Van Climatizada 01</span>
            <span className="text-[#777777]">· Marcos Vinicius</span>
          </div>

          <button
            onClick={() => openNewAppointment()}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFC400] px-3.5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
          >
            <Truck className="h-4 w-4" />
            <span>Novo Transporte</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterStatus === 'all'
              ? 'bg-[#101010] text-[#FFC400]'
              : 'bg-white border border-[#E9E9E6] text-[#777777] hover:text-[#101010]'
          }`}
        >
          Todas as Rotas ({transportAppointments.length})
        </button>
        <button
          onClick={() => setFilterStatus('Pendente')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterStatus === 'Pendente'
              ? 'bg-[#101010] text-[#FFC400]'
              : 'bg-white border border-[#E9E9E6] text-[#777777] hover:text-[#101010]'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilterStatus('Em rota')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterStatus === 'Em rota'
              ? 'bg-[#101010] text-[#FFC400]'
              : 'bg-white border border-[#E9E9E6] text-[#777777] hover:text-[#101010]'
          }`}
        >
          Em Rota
        </button>
        <button
          onClick={() => setFilterStatus('Pet recolhido')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterStatus === 'Pet recolhido'
              ? 'bg-[#101010] text-[#FFC400]'
              : 'bg-white border border-[#E9E9E6] text-[#777777] hover:text-[#101010]'
          }`}
        >
          Recolhidos
        </button>
        <button
          onClick={() => setFilterStatus('Entregue')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterStatus === 'Entregue'
              ? 'bg-[#101010] text-[#FFC400]'
              : 'bg-white border border-[#E9E9E6] text-[#777777] hover:text-[#101010]'
          }`}
        >
          Entregues
        </button>
      </div>

      {/* Daily Ordered List */}
      <div className="space-y-4">
        {filteredTransports.map((apt) => {
          const client = getClientById(apt.clientId);
          const pet = getPetById(apt.petId);
          const transport = apt.transport!;
          const nextStatus = getNextStatus(transport.status);

          return (
            <div
              key={apt.id}
              className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#FFC400] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Time & Type Indicator */}
                <div className="rounded-xl bg-[#FAF9F5] border border-[#E9E9E6] p-3 text-center min-w-[100px]">
                  <div className="font-mono text-sm font-bold text-[#101010]">
                    {transport.pickupTime || apt.time}
                  </div>
                  <span className="text-[10px] font-semibold text-[#B45309] block uppercase mt-0.5">
                    {transport.type}
                  </span>
                </div>

                {/* Pet and Tutor Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&q=80'}
                    alt={pet?.name}
                    className="h-12 w-12 rounded-xl object-cover border border-[#E9E9E6]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#101010]">{pet?.name}</h3>
                      <span className="text-xs text-[#777777]">({pet?.breed})</span>
                    </div>

                    <div className="text-xs text-[#555555] flex items-center gap-2 mt-0.5">
                      <span>Tutor: <strong>{client?.name}</strong></span>
                      <span>·</span>
                      <a
                        href={`tel:${client?.phone}`}
                        className="text-[#101010] hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>{client?.phone}</span>
                      </a>
                    </div>

                    {/* Address */}
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#555555]">
                      <MapPin className="h-3.5 w-3.5 text-[#FFC400] shrink-0" />
                      <span className="truncate max-w-md">{transport.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E9E9E6]">
                <div className="text-left lg:text-right">
                  <span className="text-[11px] text-[#777777] block">Motorista: {transport.driver}</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mt-1 ${getStatusBadge(
                      transport.status
                    )}`}
                  >
                    ● {transport.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${client?.whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(
                      client?.name || ''
                    )}!%20A%20van%20Le%20Ville%20Pet%20est%C3%A1%20a%20caminho%20para%20o%20transporte%20de%20${encodeURIComponent(
                      pet?.name || ''
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
                    title="Avisar no WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>

                  {nextStatus ? (
                    <button
                      onClick={() => updateTransportStatus(apt.id, nextStatus)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#101010] text-[#FFC400] hover:bg-neutral-800 px-4 py-2 text-xs font-bold transition-all"
                    >
                      <span>{getNextActionLabel(transport.status)}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#15803D]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Rota Concluída</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
