/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  Truck,
  CheckCircle2,
  Scissors,
  User,
  UserCheck,
  Dog,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus } from '../../types';

export const AgendaScreen: React.FC = () => {
  const {
    appointments,
    getClientById,
    getPetById,
    getServiceById,
    staff,
    openTeamModal,
    openNewAppointment,
    setSelectedAppointmentId,
  } = useApp();

  const [viewMode, setViewMode] = useState<'diaria' | 'semanal' | 'mensal'>('diaria');
  const [selectedDate, setSelectedDate] = useState('2026-11-02');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Filtered list
  const filteredAppointments = appointments.filter((apt) => {
    if (selectedStaffFilter !== 'all' && apt.staffId !== selectedStaffFilter) return false;
    if (selectedStatusFilter !== 'all' && apt.status !== selectedStatusFilter) return false;
    if (viewMode === 'diaria' && apt.date !== selectedDate) return false;
    return true;
  });

  const hoursTimeline = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  ];

  const weekDays = [
    { label: 'Segunda', date: '2026-11-02', dayNum: '02' },
    { label: 'Terça', date: '2026-11-03', dayNum: '03' },
    { label: 'Quarta', date: '2026-11-04', dayNum: '04' },
    { label: 'Quinta', date: '2026-11-05', dayNum: '05' },
    { label: 'Sexta', date: '2026-11-06', dayNum: '06' },
    { label: 'Sábado', date: '2026-11-07', dayNum: '07' },
    { label: 'Domingo', date: '2026-11-08', dayNum: '08' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
        {/* Date Selector & View Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] p-1">
            <button
              onClick={() => {
                // simple prev day toggle
                setSelectedDate('2026-11-01');
              }}
              className="rounded p-1.5 hover:bg-white text-[#555555] hover:text-[#101010]"
              title="Dia anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedDate('2026-11-02')}
              className="px-3 py-1 text-xs font-bold text-[#101010] hover:bg-white rounded"
            >
              Hoje (02 Nov)
            </button>
            <button
              onClick={() => {
                setSelectedDate('2026-11-03');
              }}
              className="rounded p-1.5 hover:bg-white text-[#555555] hover:text-[#101010]"
              title="Próximo dia"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden sm:block text-sm font-bold text-[#101010]">
            {viewMode === 'diaria' && 'Segunda-feira, 02 de Novembro de 2026'}
            {viewMode === 'semanal' && 'Semana 45 · 02 a 08 de Novembro'}
            {viewMode === 'mensal' && 'Novembro de 2026'}
          </div>
        </div>

        {/* View mode toggle + Filters + Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented View Switcher */}
          <div className="flex items-center rounded-xl bg-[#F6F6F4] p-1 border border-[#E9E9E6]">
            <button
              onClick={() => setViewMode('diaria')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'diaria'
                  ? 'bg-white text-[#101010] shadow-xs'
                  : 'text-[#777777] hover:text-[#101010]'
              }`}
            >
              Diária
            </button>
            <button
              onClick={() => setViewMode('semanal')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'semanal'
                  ? 'bg-white text-[#101010] shadow-xs'
                  : 'text-[#777777] hover:text-[#101010]'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setViewMode('mensal')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'mensal'
                  ? 'bg-white text-[#101010] shadow-xs'
                  : 'text-[#777777] hover:text-[#101010]'
              }`}
            >
              Mensal
            </button>
          </div>

          {/* Staff Filter */}
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
          >
            <option value="all">Todos os Funcionários</option>
            {staff.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} {st.registration ? `· [${st.registration}]` : ''} ({st.role})
              </option>
            ))}
          </select>

          {/* Quick Team Modal button */}
          <button
            onClick={() => openTeamModal()}
            className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-white px-3 py-2 text-xs font-bold text-[#333333] hover:bg-[#F6F6F4] hover:text-[#101010] transition-colors"
            title="Cadastrar ou editar equipe e veterinários (CRMV)"
          >
            <UserCheck className="h-4 w-4 text-[#B45309]" />
            <span className="hidden sm:inline">Equipe & CRMV</span>
          </button>

          {/* New Appointment Button */}
          <button
            onClick={() => openNewAppointment()}
            className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>NOVO AGENDAMENTO</span>
          </button>
        </div>
      </div>

      {/* VIEW: DIÁRIA */}
      {viewMode === 'diaria' && (
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between pb-3 border-b border-[#E9E9E6]">
            <div>
              <h3 className="text-base font-bold text-[#101010]">
                Atendimentos Marcados para Hoje
              </h3>
              <p className="text-xs text-[#777777]">
                Clique sobre qualquer card de agendamento para ver os detalhes, financeiro e observações.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#777777]">
              {filteredAppointments.length} agendamentos listados
            </span>
          </div>

          <div className="space-y-3">
            {hoursTimeline.map((hour) => {
              const aptsInHour = filteredAppointments.filter((a) => a.time.startsWith(hour.slice(0, 2)));

              return (
                <div key={hour} className="flex flex-col sm:flex-row sm:items-start gap-4 py-2 border-b border-[#F6F6F4]">
                  {/* Hour Indicator */}
                  <div className="w-16 shrink-0 pt-2 font-mono text-xs font-bold text-[#777777] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#FFC400]" />
                    <span>{hour}</span>
                  </div>

                  {/* Appointments in this slot */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {aptsInHour.length === 0 ? (
                      <div className="py-2 text-[11px] text-[#AAAAAA] italic">
                        Horário livre
                      </div>
                    ) : (
                      aptsInHour.map((apt) => {
                        const client = getClientById(apt.clientId);
                        const pet = getPetById(apt.petId);
                        const service = getServiceById(apt.serviceId);

                        return (
                          <div
                            key={apt.id}
                            onClick={() => setSelectedAppointmentId(apt.id)}
                            className="group cursor-pointer rounded-xl border border-[#E9E9E6] bg-[#FFFFFF] p-4 shadow-xs hover:border-[#FFC400] hover:shadow-md transition-all relative overflow-hidden"
                          >
                            {/* Status Indicator Bar */}
                            <div
                              className={`absolute top-0 left-0 bottom-0 w-1 ${
                                apt.status === 'Concluído'
                                  ? 'bg-[#15803D]'
                                  : apt.status === 'Em andamento'
                                  ? 'bg-[#1D4ED8]'
                                  : 'bg-[#FFC400]'
                              }`}
                            />

                            <div className="pl-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-xs font-bold text-[#101010]">
                                  {apt.time} · {apt.durationMinutes} min
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    apt.status === 'Concluído'
                                      ? 'bg-[#F0FDF4] text-[#15803D]'
                                      : apt.status === 'Em andamento'
                                      ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                                      : 'bg-[#FFFBEB] text-[#B45309]'
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </div>

                              {/* Pet & Tutor lockup */}
                              <div className="flex items-center gap-3 mb-2">
                                <img
                                  src={pet?.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&q=80'}
                                  alt={pet?.name}
                                  className="h-10 w-10 rounded-lg object-cover border border-[#E9E9E6]"
                                />
                                <div>
                                  <span className="font-bold text-xs text-[#101010] block group-hover:text-[#B45309] transition-colors">
                                    {pet?.name}
                                  </span>
                                  <span className="text-[11px] text-[#777777] block">
                                    {pet?.breed} ({pet?.size})
                                  </span>
                                  <span className="text-[11px] text-[#444444] font-medium">
                                    Tutor: {client?.name}
                                  </span>
                                </div>
                              </div>

                              {/* Service & Staff */}
                              <div className="pt-2 border-t border-[#F1F1EE] flex items-center justify-between text-[11px]">
                                <span className="font-medium text-[#222222] truncate max-w-[150px]">
                                  {service?.name}
                                </span>
                                <span className="text-[#777777]">{apt.staffName}</span>
                              </div>

                              {/* Transport badge if enabled */}
                              {apt.transport?.enabled && (
                                <div className="mt-2 flex items-center justify-between rounded bg-[#FAF9F5] px-2 py-1 text-[10px] text-[#B45309]">
                                  <div className="flex items-center gap-1">
                                    <Truck className="h-3 w-3" />
                                    <span>{apt.transport.type}</span>
                                  </div>
                                  <span className="font-bold">{apt.transport.status}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: SEMANAL */}
      {viewMode === 'semanal' && (
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[900px]">
            {weekDays.map((wDay) => {
              const dayApts = appointments.filter((a) => a.date === wDay.date);
              const isToday = wDay.date === '2026-11-02';

              return (
                <div
                  key={wDay.date}
                  className={`rounded-xl border p-3 flex flex-col ${
                    isToday ? 'border-[#FFC400] bg-[#FFFDF7]' : 'border-[#E9E9E6] bg-[#FAF9F8]'
                  }`}
                >
                  <div className="pb-2 mb-2 border-b border-[#E9E9E6] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#777777] uppercase block">
                        {wDay.label}
                      </span>
                      <span className={`text-base font-extrabold ${isToday ? 'text-[#101010]' : 'text-[#555555]'}`}>
                        {wDay.dayNum}
                      </span>
                    </div>
                    {isToday && (
                      <span className="h-2 w-2 rounded-full bg-[#FFC400]" title="Hoje" />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayApts.length === 0 ? (
                      <div className="text-[11px] text-[#AAAAAA] italic py-3 text-center">
                        Nenhum agendamento
                      </div>
                    ) : (
                      dayApts.map((apt) => {
                        const pet = getPetById(apt.petId);
                        const service = getServiceById(apt.serviceId);

                        return (
                          <div
                            key={apt.id}
                            onClick={() => setSelectedAppointmentId(apt.id)}
                            className="cursor-pointer rounded-lg border border-[#E9E9E6] bg-white p-2 text-xs shadow-2xs hover:border-[#FFC400] hover:shadow-xs transition-all"
                          >
                            <div className="flex items-center justify-between font-mono font-bold text-[11px] text-[#101010] mb-1">
                              <span>{apt.time}</span>
                              <span className="text-[10px] text-[#777777]">{apt.status}</span>
                            </div>
                            <span className="font-bold text-[#101010] block">{pet?.name}</span>
                            <span className="text-[10px] text-[#777777] block truncate">
                              {service?.name}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDate(wDay.date);
                      openNewAppointment();
                    }}
                    className="mt-3 w-full py-1 rounded-md border border-dashed border-[#CCCCCC] text-[11px] font-medium text-[#777777] hover:border-[#101010] hover:text-[#101010] text-center"
                  >
                    + Agendar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MENSAL */}
      {viewMode === 'mensal' && (
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between pb-3 border-b border-[#E9E9E6]">
            <div>
              <h3 className="text-base font-bold text-[#101010]">Calendário Mensal de Atendimentos</h3>
              <p className="text-xs text-[#777777]">Visão panorâmica de capacidade e agendamentos</p>
            </div>
            <span className="text-xs font-bold text-[#101010]">Novembro / 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="py-2 font-bold text-[#777777] uppercase text-[11px]">
                {day}
              </div>
            ))}

            {/* Empty slots for previous month offset */}
            <div className="h-20 p-1 rounded-lg bg-[#FBFBFA] border border-dashed border-[#E9E9E6] opacity-40">
              <span className="text-[10px] text-[#999999]">01 Nov</span>
            </div>

            {/* Days 02 to 30 */}
            {Array.from({ length: 29 }, (_, i) => {
              const day = i + 2;
              const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
              const count = appointments.filter((a) => a.date === dateStr).length;
              const isToday = day === 2;

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setViewMode('diaria');
                  }}
                  className={`h-22 p-2 rounded-xl border text-left cursor-pointer transition-all hover:border-[#FFC400] flex flex-col justify-between ${
                    isToday ? 'border-[#FFC400] bg-[#FFFDF7]' : 'border-[#E9E9E6] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-[#FFC400]' : 'text-[#222222]'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold uppercase bg-[#FFC400] text-[#101010] px-1 rounded">
                        Hoje
                      </span>
                    )}
                  </div>

                  {count > 0 ? (
                    <div className="mt-1">
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#101010] text-[#FFC400]">
                        {count} atend.
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#CCCCCC]">Livre</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
