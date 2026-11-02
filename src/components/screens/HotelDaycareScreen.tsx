/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Home,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  User,
  Dog,
  CheckCircle2,
  LogOut,
  LogIn,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HotelStatus } from '../../types';

export const HotelDaycareScreen: React.FC = () => {
  const {
    hotelBookings,
    clients,
    pets,
    getClientById,
    getPetById,
    openNewHotelBooking,
    updateHotelStatus,
    openRegisterPayment,
    setSelectedPetId,
    setCurrentScreen,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'Hospedado' | 'Check-out hoje' | 'Check-in previsto'>('all');

  const filteredBookings = hotelBookings.filter((b) => {
    if (activeFilter !== 'all' && b.status !== activeFilter) return false;
    return true;
  });

  const suitesOccupation = [
    { name: 'Suíte Presidencial Master 01', capacity: 'Cães Grandes', booking: hotelBookings.find(b => b.suiteName.includes('Master 01')) },
    { name: 'Suíte Presidencial Master 02', capacity: 'Cães Grandes', booking: hotelBookings.find(b => b.suiteName.includes('Master 02')) },
    { name: 'Suíte Climatizada Conforto 01', capacity: 'Cães Pequenos', booking: hotelBookings.find(b => b.suiteName.includes('Conforto 01')) },
    { name: 'Suíte Climatizada Conforto 02', capacity: 'Cães Pequenos', booking: hotelBookings.find(b => b.suiteName.includes('Conforto 02')) },
    { name: 'Suíte Cat Play 01 (Isolada)', capacity: 'Exclusiva Gatos', booking: hotelBookings.find(b => b.suiteName.includes('Cat Play')) },
    { name: 'Espaço Creche Play Coletivo', capacity: 'Socialização Recreativa', booking: hotelBookings.find(b => b.suiteName.includes('Creche')) },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Hospedagem VIP & Day Care
          </span>
          <h2 className="text-xl font-bold text-[#101010]">Painel de Controle do Hotelzinho</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openNewHotelBooking()}
            className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>NOVA RESERVA / ENTRADA</span>
          </button>
        </div>
      </div>

      {/* Suites & Rooms Occupancy Board */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6]">
          <div>
            <h3 className="text-base font-bold text-[#101010]">Mapa de Ocupação das Suítes</h3>
            <p className="text-xs text-[#777777]">Status em tempo real das acomodações climatizadas</p>
          </div>
          <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1 rounded-full">
            3 suítes ocupadas · 3 vagas disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suitesOccupation.map((s, idx) => {
            const isOccupied = s.booking && s.booking.status === 'Hospedado';
            const guestPet = s.booking ? getPetById(s.booking.petId) : undefined;
            const guestTutor = s.booking ? getClientById(s.booking.clientId) : undefined;

            return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-all ${
                  isOccupied
                    ? 'border-[#FFC400] bg-[#FFFDF7]'
                    : 'border-[#E9E9E6] bg-[#FAF9F8]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#101010]">{s.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOccupied
                        ? 'bg-[#101010] text-[#FFC400]'
                        : 'bg-[#F0FDF4] text-[#15803D]'
                    }`}
                  >
                    {isOccupied ? 'Ocupado' : 'Disponível'}
                  </span>
                </div>

                <span className="text-[11px] text-[#777777] block mb-3">{s.capacity}</span>

                {isOccupied && guestPet ? (
                  <div className="pt-2 border-t border-[#F1EFE8] flex items-center gap-3">
                    <img
                      src={guestPet.photoUrl}
                      alt={guestPet.name}
                      className="h-10 w-10 rounded-lg object-cover border border-[#E9E9E6]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#101010] block">{guestPet.name}</span>
                      <span className="text-[11px] text-[#555555]">Tutor: {guestTutor?.name}</span>
                      <span className="text-[10px] font-mono text-[#B45309]">
                        Saída: {s.booking?.checkOutDate}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#E9E9E6] text-center">
                    <button
                      onClick={() => openNewHotelBooking()}
                      className="text-[11px] font-bold text-[#777777] hover:text-[#101010] underline"
                    >
                      Reservar esta Suíte
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookings & Active Stays Table */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E9E6]">
          <div>
            <h3 className="text-base font-bold text-[#101010]">Animais Hospedados e Reservas</h3>
            <p className="text-xs text-[#777777]">Controle de check-in, check-out e cobranças</p>
          </div>

          <div className="flex items-center gap-1 bg-[#F6F6F4] p-1 rounded-xl border border-[#E9E9E6]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === 'all' ? 'bg-white text-[#101010] shadow-xs' : 'text-[#777777]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('Hospedado')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === 'Hospedado' ? 'bg-white text-[#101010] shadow-xs' : 'text-[#777777]'
              }`}
            >
              Hospedados
            </button>
            <button
              onClick={() => setActiveFilter('Check-in previsto')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === 'Check-in previsto' ? 'bg-white text-[#101010] shadow-xs' : 'text-[#777777]'
              }`}
            >
              Previstos
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                <th className="pb-3 pl-2">Animal (Pet)</th>
                <th className="pb-3">Tutor</th>
                <th className="pb-3">Acomodação</th>
                <th className="pb-3">Entrada (Check-in)</th>
                <th className="pb-3">Saída Prevista</th>
                <th className="pb-3">Diárias</th>
                <th className="pb-3">Valor Total</th>
                <th className="pb-3">Pagamento</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1EE]">
              {filteredBookings.map((b) => {
                const pet = getPetById(b.petId);
                const client = getClientById(b.clientId);

                return (
                  <tr key={b.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&q=80'}
                          alt={pet?.name}
                          className="h-10 w-10 rounded-lg object-cover border border-[#E9E9E6]"
                        />
                        <div>
                          <span className="font-bold text-[#101010] block">{pet?.name}</span>
                          <span className="text-[11px] text-[#777777]">{pet?.breed}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="font-semibold text-[#222222] block">{client?.name}</span>
                      <span className="text-[11px] text-[#777777]">{client?.phone}</span>
                    </td>

                    <td className="py-3.5 text-[#555555]">
                      <span className="font-medium text-[#101010] block">{b.suiteName}</span>
                      <span className="text-[10px] text-[#888888]">{b.category}</span>
                    </td>

                    <td className="py-3.5 font-mono text-[#555555]">
                      <span className="block font-semibold text-[#101010]">{b.checkInDate}</span>
                      <span className="text-[11px] text-[#888888]">{b.checkInTime}</span>
                    </td>

                    <td className="py-3.5 font-mono text-[#555555]">
                      <span className="block font-semibold text-[#101010]">{b.checkOutDate}</span>
                      <span className="text-[11px] text-[#888888]">{b.checkOutTime}</span>
                    </td>

                    <td className="py-3.5 font-mono font-bold text-[#101010]">
                      {b.daysCount} d
                    </td>

                    <td className="py-3.5 font-mono font-extrabold text-[#101010]">
                      R$ {b.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.paymentStatus === 'Pago'
                            ? 'bg-[#F0FDF4] text-[#15803D]'
                            : b.paymentStatus === 'Parcial'
                            ? 'bg-[#FFFBEB] text-[#B45309]'
                            : 'bg-[#FEF2F2] text-[#DC2626]'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          b.status === 'Hospedado'
                            ? 'bg-[#101010] text-[#FFC400]'
                            : b.status === 'Finalizado'
                            ? 'bg-[#F0FDF4] text-[#15803D]'
                            : 'bg-[#EFF6FF] text-[#1D4ED8]'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3.5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'Hospedado' && (
                          <button
                            onClick={() => updateHotelStatus(b.id, 'Finalizado')}
                            className="rounded-md bg-[#101010] text-white px-2.5 py-1 text-[11px] font-bold hover:bg-neutral-800"
                          >
                            Check-out
                          </button>
                        )}
                        {b.status === 'Check-in previsto' && (
                          <button
                            onClick={() => updateHotelStatus(b.id, 'Hospedado')}
                            className="rounded-md bg-[#FFC400] text-[#101010] px-2.5 py-1 text-[11px] font-bold hover:bg-[#E5B000]"
                          >
                            Check-in
                          </button>
                        )}
                      </div>
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
