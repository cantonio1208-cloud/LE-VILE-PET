/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Dog,
  Scissors,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, TransportStatus } from '../../types';

export const AppointmentDetailModal: React.FC = () => {
  const {
    selectedAppointmentId,
    setSelectedAppointmentId,
    appointments,
    getClientById,
    getPetById,
    getServiceById,
    invoices,
    updateAppointmentStatus,
    updateTransportStatus,
    openRegisterPayment,
    setSelectedClientId,
    setSelectedPetId,
    setCurrentScreen,
  } = useApp();

  if (!selectedAppointmentId) return null;

  const apt = appointments.find((a) => a.id === selectedAppointmentId);
  if (!apt) return null;

  const client = getClientById(apt.clientId);
  const pet = getPetById(apt.petId);
  const service = getServiceById(apt.serviceId);
  const linkedInvoice = invoices.find((i) => i.appointmentId === apt.id);

  const statusOptions: AppointmentStatus[] = [
    'Aguardando',
    'Confirmado',
    'Em andamento',
    'Concluído',
    'Cancelado',
  ];

  const transportOptions: TransportStatus[] = [
    'Pendente',
    'Em rota',
    'Pet recolhido',
    'Entregue',
  ];

  const handleOpenClient = () => {
    setSelectedAppointmentId(null);
    setSelectedClientId(apt.clientId);
    setCurrentScreen('clientes');
  };

  const handleOpenPet = () => {
    setSelectedAppointmentId(null);
    setSelectedPetId(apt.petId);
    setCurrentScreen('pets');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFC400]/20 text-[#101010]">
              <Calendar className="h-5 w-5 text-[#B45309]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                Detalhes do Atendimento #{apt.id}
              </span>
              <h2 className="text-base font-bold text-[#101010]">
                {service?.name || 'Atendimento'}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setSelectedAppointmentId(null)}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#F6F6F4] border border-[#E9E9E6]">
            <div>
              <span className="text-[11px] text-[#777777] block">Data</span>
              <span className="font-bold text-[#101010]">{apt.date}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#777777] block">Horário</span>
              <span className="font-bold text-[#101010]">{apt.time} ({apt.durationMinutes} min)</span>
            </div>
            <div>
              <span className="text-[11px] text-[#777777] block">Profissional</span>
              <span className="font-bold text-[#101010]">{apt.staffName}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#777777] block">Status Atual</span>
              <span className="font-bold text-[#101010]">{apt.status}</span>
            </div>
          </div>

          {/* Client & Pet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pet Card */}
            <div className="p-3.5 rounded-xl border border-[#E9E9E6] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&q=80'}
                  alt={pet?.name}
                  className="h-12 w-12 rounded-lg object-cover border border-[#E9E9E6]"
                />
                <div>
                  <span className="font-bold text-[#101010] block text-sm">{pet?.name}</span>
                  <span className="text-[#777777] text-[11px] block">{pet?.breed} · {pet?.size}</span>
                  <span className="text-[#B45309] text-[11px] font-medium">{pet?.weight} kg · {pet?.sex}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenPet}
                className="p-1.5 rounded-md hover:bg-[#F6F6F4] text-[#777777] hover:text-[#101010]"
                title="Ver perfil completo do Pet"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            {/* Tutor Card */}
            <div className="p-3.5 rounded-xl border border-[#E9E9E6] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#777777] block">Tutor Responsável</span>
                <span className="font-bold text-[#101010] block text-sm">{client?.name}</span>
                <span className="text-[#777777] text-[11px] block">{client?.phone}</span>
                <span className="text-[#777777] text-[11px] block truncate max-w-[180px]">
                  {client?.address.neighborhood}, {client?.address.city}
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenClient}
                className="p-1.5 rounded-md hover:bg-[#F6F6F4] text-[#777777] hover:text-[#101010]"
                title="Ver cadastro do tutor"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Operational Notes */}
          {apt.notes && (
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#F2EFE5]">
              <span className="font-bold text-[#222222] block mb-1">Observações do Tutor & Manejo:</span>
              <p className="text-[#555555] leading-relaxed">{apt.notes}</p>
            </div>
          )}

          {/* Transport Logistics Info if enabled */}
          {apt.transport?.enabled && (
            <div className="p-4 rounded-xl border border-[#E9E9E6] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#FFC400]" />
                  <span className="font-bold text-[#101010]">Logística Táxi Dog</span>
                </div>
                <span className="font-mono font-bold text-xs">Taxa: R$ {apt.transport.transportFee.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#555555] pt-1">
                <div>Modalidade: <strong className="text-[#222222]">{apt.transport.type}</strong></div>
                <div>Motorista: <strong className="text-[#222222]">{apt.transport.driver}</strong></div>
                <div className="col-span-2">Endereço: <strong className="text-[#222222]">{apt.transport.address}</strong></div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-2 border-t border-[#E9E9E6]">
                <span className="text-[11px] font-semibold text-[#777777] block mb-1.5">
                  Atualizar Status da Rota:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {transportOptions.map((tOpt) => (
                    <button
                      key={tOpt}
                      type="button"
                      onClick={() => updateTransportStatus(apt.id, tOpt)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        apt.transport?.status === tOpt
                          ? 'bg-[#101010] text-[#FFC400]'
                          : 'bg-[#F6F6F4] text-[#555555] hover:bg-[#E9E9E6]'
                      }`}
                    >
                      {tOpt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Financial Invoice Associated */}
          <div className="p-4 rounded-xl border border-[#E9E9E6] bg-[#F6F6F4] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#101010]" />
                <span className="font-bold text-[#101010]">Lançamento Financeiro</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-[#101010]">
                  R$ {(apt.amount + (apt.transport?.transportFee || 0)).toFixed(2)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    apt.paymentStatus === 'Pago'
                      ? 'bg-[#F0FDF4] text-[#15803D]'
                      : apt.paymentStatus === 'Parcial'
                      ? 'bg-[#FFFBEB] text-[#B45309]'
                      : 'bg-[#FEF2F2] text-[#DC2626]'
                  }`}
                >
                  {apt.paymentStatus}
                </span>
              </div>
            </div>

            {linkedInvoice && (
              <div className="flex items-center justify-between text-[11px] text-[#555555] pt-1">
                <span>Recibo: {linkedInvoice.receiptNumber}</span>
                <span>Forma: {linkedInvoice.paymentMethod}</span>
                {linkedInvoice.balanceDue > 0 && (
                  <span className="text-[#DC2626] font-bold">
                    Falta pagar: R$ {linkedInvoice.balanceDue.toFixed(2)}
                  </span>
                )}
              </div>
            )}

            {apt.paymentStatus !== 'Pago' && linkedInvoice && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAppointmentId(null);
                    openRegisterPayment(linkedInvoice);
                  }}
                  className="w-full py-2 rounded-lg bg-[#15803D] text-white font-bold text-xs hover:bg-[#166534] transition-colors"
                >
                  Receber Pagamento Desta Fatura
                </button>
              </div>
            )}
          </div>

          {/* Change Appointment Status */}
          <div className="pt-2 border-t border-[#E9E9E6]">
            <span className="text-xs font-bold text-[#222222] block mb-2">
              Alterar Situação do Atendimento:
            </span>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => updateAppointmentStatus(apt.id, st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    apt.status === st
                      ? 'bg-[#FFC400] text-[#101010] shadow-xs'
                      : 'bg-[#F6F6F4] text-[#555555] hover:bg-[#E9E9E6]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-[#E9E9E6] bg-[#FBFBFA]">
          <button
            type="button"
            onClick={() => setSelectedAppointmentId(null)}
            className="rounded-lg bg-[#101010] px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
