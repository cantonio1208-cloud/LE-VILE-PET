/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Dog,
  Search,
  Plus,
  ArrowLeft,
  Calendar,
  Home,
  CreditCard,
  Heart,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PetSpecies, PetSize } from '../../types';

export const PetsScreen: React.FC = () => {
  const {
    pets,
    clients,
    appointments,
    hotelBookings,
    invoices,
    selectedPetId,
    setSelectedPetId,
    setSelectedClientId,
    openNewPet,
    openNewAppointment,
    openNewHotelBooking,
    openRegisterPayment,
    getClientById,
    getAppointmentsByPetId,
    getHotelBookingsByPetId,
    getInvoicesByPetId,
    setCurrentScreen,
  } = useApp();

  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [profileTab, setProfileTab] = useState<'info' | 'historico' | 'agendamentos' | 'hospedagens' | 'financeiro'>('info');

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (speciesFilter !== 'all' && pet.species !== speciesFilter) return false;
    if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false;

    return true;
  });

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const tutor = selectedPet ? getClientById(selectedPet.clientId) : undefined;
  const petAppointments = selectedPet ? getAppointmentsByPetId(selectedPet.id) : [];
  const petHotelBookings = selectedPet ? getHotelBookingsByPetId(selectedPet.id) : [];
  const petInvoices = selectedPet ? getInvoicesByPetId(selectedPet.id) : [];

  const petFutureAppointments = petAppointments.filter(
    (a) => a.date >= '2026-11-02' && a.status !== 'Concluído'
  );
  const petPastAppointments = petAppointments.filter(
    (a) => a.date < '2026-11-02' || a.status === 'Concluído'
  );

  const petTotalSpent = petInvoices.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const petPendingBalance = petInvoices.reduce((acc, curr) => acc + curr.balanceDue, 0);

  // INDIVIDUAL PET PROFILE VIEW (5 TABS)
  if (selectedPet) {
    return (
      <div className="space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPetId(null)}
            className="flex items-center gap-2 rounded-xl border border-[#E9E9E6] bg-white px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#F6F6F4] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Galeria de Pets</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openNewAppointment(selectedPet.clientId, selectedPet.id)}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Agendar Banho / Tosa</span>
            </button>

            <button
              onClick={() => openNewHotelBooking()}
              className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-white px-3.5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#F6F6F4]"
            >
              <Home className="h-3.5 w-3.5 text-[#777777]" />
              <span>Reservar Hotel / Creche</span>
            </button>
          </div>
        </div>

        {/* Pet Profile Hero Card */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <img
                src={selectedPet.photoUrl}
                alt={selectedPet.name}
                className="h-24 w-24 rounded-2xl object-cover border-2 border-[#E9E9E6] shadow-xs"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#101010]">{selectedPet.name}</h2>
                  <span className="rounded-full bg-[#101010] px-2.5 py-0.5 text-[11px] font-bold text-[#FFC400]">
                    {selectedPet.species} · {selectedPet.sex}
                  </span>
                  {selectedPet.microchip && (
                    <span className="text-[11px] font-mono text-[#777777] bg-[#F6F6F4] border border-[#E9E9E6] px-2 py-0.5 rounded-md">
                      Chip: {selectedPet.microchip}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#555555]">
                  <span>Raça: <strong className="text-[#222222]">{selectedPet.breed}</strong></span>
                  <span>·</span>
                  <span>Porte: <strong className="text-[#222222]">{selectedPet.size}</strong></span>
                  <span>·</span>
                  <span>Peso: <strong className="text-[#222222] font-mono">{selectedPet.weight} kg</strong></span>
                  <span>·</span>
                  <span>Idade: <strong className="text-[#222222]">{selectedPet.age}</strong></span>
                </div>

                {/* Tutor Link */}
                <div className="pt-1 flex items-center gap-2 text-xs">
                  <span className="text-[#777777]">Tutor Responsável:</span>
                  <button
                    onClick={() => {
                      setSelectedClientId(selectedPet.clientId);
                      setCurrentScreen('clientes');
                    }}
                    className="font-bold text-[#101010] hover:text-[#B45309] hover:underline flex items-center gap-1"
                  >
                    <span>{tutor?.name}</span>
                    <span className="text-[#777777] font-normal">({tutor?.phone})</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Balance indicator */}
            <div className="rounded-xl border border-[#E9E9E6] bg-[#FBFBFA] p-4 text-xs space-y-1.5 text-right min-w-[200px]">
              <span className="text-[#777777] block text-[11px]">Gastos Acumulados no Pet Shop:</span>
              <span className="text-xl font-bold font-mono text-[#101010] block">
                R$ {petTotalSpent.toFixed(2)}
              </span>
              {petPendingBalance > 0 ? (
                <span className="text-[11px] font-bold text-[#DC2626] block">
                  Pendente: R$ {petPendingBalance.toFixed(2)}
                </span>
              ) : (
                <span className="text-[11px] font-bold text-[#15803D] block">
                  Sem débitos pendentes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 5 TABS NAVIGATION */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E9E9E6] pb-3 overflow-x-auto">
            <button
              onClick={() => setProfileTab('info')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                profileTab === 'info'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              1. Informações Clínicas & Manejo
            </button>

            <button
              onClick={() => setProfileTab('historico')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                profileTab === 'historico'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              2. Histórico de Serviços ({petPastAppointments.length})
            </button>

            <button
              onClick={() => setProfileTab('agendamentos')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                profileTab === 'agendamentos'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              3. Agendamentos Futuros ({petFutureAppointments.length})
            </button>

            <button
              onClick={() => setProfileTab('hospedagens')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                profileTab === 'hospedagens'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              4. Hospedagens & Creche ({petHotelBookings.length})
            </button>

            <button
              onClick={() => setProfileTab('financeiro')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                profileTab === 'financeiro'
                  ? 'bg-[#101010] text-[#FFC400]'
                  : 'text-[#777777] hover:text-[#101010] hover:bg-[#F6F6F4]'
              }`}
            >
              5. Financeiro ({petInvoices.length})
            </button>
          </div>

          {/* TAB 1: INFORMAÇÕES */}
          {profileTab === 'info' && (
            <div className="space-y-6 pt-2 text-xs">
              {/* Warnings and Special Cares */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#DC2626] font-bold">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Alergias & Sensibilidades Conhecidas</span>
                  </div>
                  <p className="text-[#991B1B] leading-relaxed">
                    {selectedPet.allergies || 'Nenhuma alergia relatada.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#B45309] font-bold">
                    <Heart className="h-4 w-4" />
                    <span>Cuidados Especiais & Manejo Físico</span>
                  </div>
                  <p className="text-[#92400E] leading-relaxed">
                    {selectedPet.specialCare || 'Manejo padrão sem restrições.'}
                  </p>
                </div>
              </div>

              {/* Behavior Notes */}
              <div className="p-4 rounded-xl border border-[#E9E9E6] bg-[#FAF9F5] space-y-1.5">
                <span className="font-bold text-[#101010] block">Temperamento e Dicas da Equipe:</span>
                <p className="text-[#555555] leading-relaxed">{selectedPet.notes}</p>
              </div>

              {/* Vaccine Passport */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#101010]">Carteira de Vacinação do Animal</h4>
                  <span className="text-[11px] text-[#777777]">Exigência para Hotel e Creche</span>
                </div>

                <div className="rounded-xl border border-[#E9E9E6] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#F6F6F4] text-[#777777] font-semibold">
                        <th className="py-2.5 px-4">Vacina</th>
                        <th className="py-2.5 px-4">Data Aplicação</th>
                        <th className="py-2.5 px-4">Validade</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F1EE]">
                      {selectedPet.vaccines.map((v, i) => (
                        <tr key={i} className="hover:bg-[#FBFBFA]">
                          <td className="py-2.5 px-4 font-semibold text-[#101010]">{v.name}</td>
                          <td className="py-2.5 px-4 font-mono text-[#555555]">{v.date}</td>
                          <td className="py-2.5 px-4 font-mono text-[#555555]">{v.validUntil}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                v.status === 'Em dia'
                                  ? 'bg-[#F0FDF4] text-[#15803D]'
                                  : 'bg-[#FEF2F2] text-[#DC2626]'
                              }`}
                            >
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HISTÓRICO DE SERVIÇOS */}
          {profileTab === 'historico' && (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                    <th className="pb-3 pl-2">Data</th>
                    <th className="pb-3">Serviço Realizado</th>
                    <th className="pb-3">Profissional</th>
                    <th className="pb-3">Duração</th>
                    <th className="pb-3">Valor</th>
                    <th className="pb-3">Observações do Tosador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F1EE]">
                  {petPastAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#F9F9F8]">
                      <td className="py-3 pl-2 font-mono font-bold text-[#101010]">{apt.date}</td>
                      <td className="py-3 font-semibold text-[#101010]">Banho & Tosa Especializada</td>
                      <td className="py-3 text-[#555555]">{apt.staffName}</td>
                      <td className="py-3 font-mono text-[#555555]">{apt.durationMinutes} min</td>
                      <td className="py-3 font-mono font-bold text-[#101010]">R$ {apt.amount.toFixed(2)}</td>
                      <td className="py-3 text-[#555555] italic">{apt.notes || 'Procedimento sem intercorrências'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: AGENDAMENTOS FUTUROS */}
          {profileTab === 'agendamentos' && (
            <div className="space-y-3 pt-2">
              {petFutureAppointments.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#E9E9E6] rounded-xl text-xs text-[#777777]">
                  Nenhum agendamento futuro para {selectedPet.name}.
                  <div className="mt-3">
                    <button
                      onClick={() => openNewAppointment(selectedPet.clientId, selectedPet.id)}
                      className="px-4 py-2 bg-[#FFC400] text-[#101010] font-bold rounded-lg text-xs hover:bg-[#E5B000]"
                    >
                      Agendar Atendimento Agora
                    </button>
                  </div>
                </div>
              ) : (
                petFutureAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-[#E9E9E6] bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#101010]">
                          {apt.date} às {apt.time}
                        </span>
                        <span className="bg-[#FFFBEB] text-[#B45309] font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {apt.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#555555]">
                        Profissional: {apt.staffName} · Duração: {apt.durationMinutes} min
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-[#101010] block">
                        R$ {apt.amount.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-[#777777]">{apt.paymentStatus}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: HOSPEDAGENS & CRECHE */}
          {profileTab === 'hospedagens' && (
            <div className="space-y-3 pt-2">
              {petHotelBookings.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#E9E9E6] rounded-xl text-xs text-[#777777]">
                  {selectedPet.name} ainda não possui histórico de hotel ou creche.
                </div>
              ) : (
                petHotelBookings.map((hb) => (
                  <div
                    key={hb.id}
                    className="p-4 rounded-xl border border-[#E9E9E6] bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-[#101010]">{hb.suiteName}</span>
                        <span className="bg-[#F0FDF4] text-[#15803D] font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {hb.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#555555]">
                        Período: {hb.checkInDate} ({hb.checkInTime}) até {hb.checkOutDate} ({hb.checkOutTime}) · {hb.daysCount} diárias
                      </span>
                      {hb.specialDiet && (
                        <p className="text-[10px] text-[#777777] mt-1">Dieta: {hb.specialDiet}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-[#101010] block">
                        R$ {hb.totalAmount.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-[#777777]">{hb.paymentStatus}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: FINANCEIRO */}
          {profileTab === 'financeiro' && (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E9E6] text-[#777777] font-semibold">
                    <th className="pb-3 pl-2">Recibo</th>
                    <th className="pb-3">Serviço</th>
                    <th className="pb-3">Data</th>
                    <th className="pb-3">Valor Total</th>
                    <th className="pb-3">Valor Pago</th>
                    <th className="pb-3">Saldo</th>
                    <th className="pb-3">Situação</th>
                    <th className="pb-3 pr-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F1EE]">
                  {petInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F9F9F8]">
                      <td className="py-3 pl-2 font-mono font-semibold text-[#101010]">{inv.receiptNumber}</td>
                      <td className="py-3 font-medium text-[#222222]">{inv.serviceTitle}</td>
                      <td className="py-3 font-mono text-[#555555]">{inv.invoiceDate}</td>
                      <td className="py-3 font-mono font-bold text-[#101010]">R$ {inv.amount.toFixed(2)}</td>
                      <td className="py-3 font-mono text-[#15803D]">R$ {inv.amountPaid.toFixed(2)}</td>
                      <td className="py-3 font-mono font-bold text-[#DC2626]">R$ {inv.balanceDue.toFixed(2)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Pago'
                              ? 'bg-[#F0FDF4] text-[#15803D]'
                              : 'bg-[#FEF2F2] text-[#DC2626]'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => openRegisterPayment(inv)}
                            className="rounded-md bg-[#15803D] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#166534]"
                          >
                            Pagar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: PET GALLERY
  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pet por nome ou raça..."
            className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] py-2 pl-9 pr-4 text-xs text-[#222222] placeholder-[#999999] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Species Filter */}
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
          >
            <option value="all">Todas as Espécies</option>
            <option value="Cão">Cães (Caninos)</option>
            <option value="Gato">Gatos (Felinos)</option>
          </select>

          {/* Size Filter */}
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
          >
            <option value="all">Todos os Portes</option>
            <option value="Pequeno">Porte Pequeno</option>
            <option value="Médio">Porte Médio</option>
            <option value="Grande">Porte Grande</option>
          </select>

          <button
            onClick={() => openNewPet()}
            className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>NOVO PET</span>
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPets.map((pet) => {
          const tutor = getClientById(pet.clientId);

          return (
            <div
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className="group cursor-pointer rounded-2xl border border-[#E9E9E6] bg-white p-4 shadow-xs hover:border-[#FFC400] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-3 aspect-4/3 w-full overflow-hidden rounded-xl bg-[#F6F6F4]">
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 rounded-md bg-[#101010]/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-[#FFC400]">
                    {pet.species} · {pet.sex}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#101010] group-hover:text-[#B45309] transition-colors">
                      {pet.name}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-[#555555]">
                      {pet.weight} kg
                    </span>
                  </div>

                  <span className="text-xs text-[#777777] block font-medium">
                    {pet.breed} · Porte {pet.size}
                  </span>

                  <span className="text-[11px] text-[#555555] block truncate">
                    Tutor: <strong className="text-[#222222]">{tutor?.name}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F1EE] flex items-center justify-between text-xs font-bold text-[#101010]">
                <span>Prontuário & Histórico</span>
                <ChevronRight className="h-4 w-4 text-[#777777] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
