/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Home, Calendar, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewHotelBookingModal: React.FC = () => {
  const {
    isNewHotelBookingOpen,
    closeNewHotelBooking,
    clients,
    getPetsByClientId,
    addHotelBooking,
  } = useApp();

  const [clientId, setClientId] = useState('');
  const [petId, setPetId] = useState('');
  const [category, setCategory] = useState<'Hotelzinho' | 'Creche'>('Hotelzinho');
  const [suiteName, setSuiteName] = useState('Suíte Climatizada Conforto 01');
  const [checkInDate, setCheckInDate] = useState('2026-11-02');
  const [checkInTime, setCheckInTime] = useState('09:00');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-04');
  const [checkOutTime, setCheckOutTime] = useState('18:00');
  const [daysCount, setDaysCount] = useState(2);
  const [dailyRate, setDailyRate] = useState(140.0);
  const [paymentStatus, setPaymentStatus] = useState<'Pago' | 'Pendente'>('Pendente');
  const [specialDiet, setSpecialDiet] = useState('');
  const [medicationNotes, setMedicationNotes] = useState('');
  const [belongingsNotes, setBelongingsNotes] = useState('');

  useEffect(() => {
    if (isNewHotelBookingOpen) {
      const defaultClient = clients.length > 0 ? clients[0].id : '';
      setClientId(defaultClient);
      const clientPets = getPetsByClientId(defaultClient);
      setPetId(clientPets.length > 0 ? clientPets[0].id : '');
    }
  }, [isNewHotelBookingOpen, clients]);

  const handleClientChange = (newClientId: string) => {
    setClientId(newClientId);
    const clientPets = getPetsByClientId(newClientId);
    setPetId(clientPets.length > 0 ? clientPets[0].id : '');
  };

  const handleCategoryChange = (newCat: 'Hotelzinho' | 'Creche') => {
    setCategory(newCat);
    if (newCat === 'Creche') {
      setSuiteName('Espaço Creche Play Coletivo');
      setDailyRate(85.0);
      setDaysCount(1);
      setCheckOutDate(checkInDate);
    } else {
      setSuiteName('Suíte Climatizada Conforto 01');
      setDailyRate(140.0);
      setDaysCount(2);
    }
  };

  if (!isNewHotelBookingOpen) return null;

  const clientPets = clientId ? getPetsByClientId(clientId) : [];
  const totalAmount = daysCount * dailyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !petId) return;

    addHotelBooking({
      clientId,
      petId,
      suiteName,
      category,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      daysCount,
      dailyRate,
      totalAmount,
      paymentStatus,
      status: 'Hospedado',
      specialDiet,
      medicationNotes,
      belongingsNotes,
    });

    closeNewHotelBooking();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Módulo de Hospedagem
            </span>
            <h2 className="text-lg font-bold text-[#101010]">
              Nova Reserva de Hotelzinho ou Creche
            </h2>
          </div>
          <button
            onClick={closeNewHotelBooking}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Category Toggle */}
          <div className="flex items-center gap-2 p-1 bg-[#F6F6F4] rounded-lg">
            <button
              type="button"
              onClick={() => handleCategoryChange('Hotelzinho')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                category === 'Hotelzinho'
                  ? 'bg-white text-[#101010] shadow-xs'
                  : 'text-[#777777] hover:text-[#101010]'
              }`}
            >
              Hotelzinho VIP (Pernoite)
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('Creche')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                category === 'Creche'
                  ? 'bg-white text-[#101010] shadow-xs'
                  : 'text-[#777777] hover:text-[#101010]'
              }`}
            >
              Creche Day Care (Diurno)
            </button>
          </div>

          {/* Client & Pet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Tutor Responsável *
              </label>
              <select
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Pet Hospedado *
              </label>
              <select
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                required
                disabled={clientPets.length === 0}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              >
                {clientPets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} · {p.breed})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Suite accommodation */}
          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1">
              Acomodação / Canil / Suíte *
            </label>
            <select
              value={suiteName}
              onChange={(e) => setSuiteName(e.target.value)}
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
            >
              {category === 'Hotelzinho' ? (
                <>
                  <option value="Suíte Climatizada Conforto 01">Suíte Climatizada Conforto 01 (Pequeno porte)</option>
                  <option value="Suíte Climatizada Conforto 02">Suíte Climatizada Conforto 02 (Pequeno porte)</option>
                  <option value="Suíte Presidencial Master 01">Suíte Presidencial Master 01 (Médio e Grande porte)</option>
                  <option value="Suíte Presidencial Master 02">Suíte Presidencial Master 02 (Grande porte)</option>
                  <option value="Suíte Cat Play 01 (Isolada)">Suíte Cat Play 01 (Exclusiva para Felinos)</option>
                </>
              ) : (
                <>
                  <option value="Espaço Creche Play Coletivo">Espaço Creche Play Coletivo (Social)</option>
                  <option value="Espaço Creche Relax Individual">Espaço Creche Relax (Cães tímidos)</option>
                </>
              )}
            </select>
          </div>

          {/* Check-in & Check-out */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#555555] mb-1">
                Check-in Data
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-2 py-1.5 text-xs text-[#222222]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#555555] mb-1">
                Horário Entrada
              </label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-2 py-1.5 text-xs text-[#222222]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#555555] mb-1">
                Check-out Data
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-2 py-1.5 text-xs text-[#222222]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#555555] mb-1">
                Horário Saída
              </label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-2 py-1.5 text-xs text-[#222222]"
              />
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#F6F6F4] border border-[#E9E9E6]">
            <div>
              <label className="block text-xs font-semibold text-[#555555] mb-1">
                Diárias
              </label>
              <input
                type="number"
                min="1"
                value={daysCount}
                onChange={(e) => setDaysCount(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-[#E9E9E6] bg-white px-3 py-1.5 text-xs font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#555555] mb-1">
                Valor Diária (R$)
              </label>
              <input
                type="number"
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E9E9E6] bg-white px-3 py-1.5 text-xs font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#555555] mb-1">
                Total Estimado
              </label>
              <div className="rounded-lg bg-white border border-[#E9E9E6] px-3 py-1.5 text-xs font-extrabold font-mono text-[#101010]">
                R$ {totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Care and diet */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Instruções de Alimentação / Dieta Especial
              </label>
              <input
                type="text"
                value={specialDiet}
                onChange={(e) => setSpecialDiet(e.target.value)}
                placeholder="Ex: Ração trazida pelo tutor, 80g às 08h e às 18h..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Pertences & Brinquedos Deixados
              </label>
              <input
                type="text"
                value={belongingsNotes}
                onChange={(e) => setBelongingsNotes(e.target.value)}
                placeholder="Ex: Caminha azul, 1 cobertor, mordedor de pelúcia, pote próprio..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
            <button
              type="button"
              onClick={closeNewHotelBooking}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
            >
              Registrar Entrada / Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
