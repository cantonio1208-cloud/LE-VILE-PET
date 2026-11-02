/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, Truck, AlertCircle, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, TransportType } from '../../types';

export const NewAppointmentModal: React.FC = () => {
  const {
    isNewAppointmentOpen,
    closeNewAppointment,
    prefilledAppointmentClient,
    prefilledAppointmentPet,
    clients,
    services,
    staff,
    openTeamModal,
    getPetsByClientId,
    getClientById,
    getServiceById,
    addAppointment,
  } = useApp();

  const [clientId, setClientId] = useState('');
  const [petId, setPetId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('2026-11-02');
  const [time, setTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [staffId, setStaffId] = useState('');
  const [amount, setAmount] = useState(110.0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [paymentStatus, setPaymentStatus] = useState<'Pago' | 'Pendente'>('Pendente');
  const [notes, setNotes] = useState('');

  // Transport options
  const [transportEnabled, setTransportEnabled] = useState(false);
  const [transportType, setTransportType] = useState<TransportType>('Leva e Traz Completo');
  const [transportDriver, setTransportDriver] = useState('Marcos Vinicius');
  const [transportFee, setTransportFee] = useState(35.0);
  const [pickupTime, setPickupTime] = useState('08:30');
  const [deliveryTime, setDeliveryTime] = useState('11:00');

  useEffect(() => {
    if (isNewAppointmentOpen) {
      const defaultClient = prefilledAppointmentClient || (clients.length > 0 ? clients[0].id : '');
      setClientId(defaultClient);

      const clientPets = getPetsByClientId(defaultClient);
      const defaultPet = prefilledAppointmentPet || (clientPets.length > 0 ? clientPets[0].id : '');
      setPetId(defaultPet);

      const defaultService = services.length > 0 ? services[0].id : '';
      setServiceId(defaultService);
      if (services.length > 0) {
        setAmount(services[0].price);
        setDurationMinutes(services[0].durationMinutes);
      }

      const defaultStaff = staff.length > 0 ? staff[0].id : '';
      setStaffId(defaultStaff);
    }
  }, [isNewAppointmentOpen, prefilledAppointmentClient, prefilledAppointmentPet, clients, services, staff]);

  // When client changes, update pet list
  const handleClientChange = (newClientId: string) => {
    setClientId(newClientId);
    const clientPets = getPetsByClientId(newClientId);
    if (clientPets.length > 0) {
      setPetId(clientPets[0].id);
    } else {
      setPetId('');
    }
  };

  // When service changes, update price and duration
  const handleServiceChange = (newServiceId: string) => {
    setServiceId(newServiceId);
    const service = getServiceById(newServiceId);
    if (service) {
      setAmount(service.price);
      setDurationMinutes(service.durationMinutes);
    }
  };

  const clientPets = clientId ? getPetsByClientId(clientId) : [];
  const selectedClient = getClientById(clientId);

  if (!isNewAppointmentOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !petId || !serviceId || !staffId) {
      return;
    }

    const assignedStaff = staff.find((s) => s.id === staffId);
    const clientAddress = selectedClient
      ? `${selectedClient.address.street}, ${selectedClient.address.number} - ${selectedClient.address.neighborhood}`
      : 'Endereço cadastrado';

    addAppointment({
      clientId,
      petId,
      serviceId,
      date,
      time,
      durationMinutes,
      staffId,
      staffName: assignedStaff?.name || 'Equipe Le Ville',
      status: 'Confirmado',
      amount,
      paymentStatus,
      paymentMethod,
      notes,
      transport: transportEnabled
        ? {
            enabled: true,
            type: transportType,
            status: 'Pendente',
            driver: transportDriver,
            address: clientAddress,
            pickupTime: transportType !== 'Entrega' ? pickupTime : undefined,
            deliveryTime: transportType !== 'Busca' ? deliveryTime : undefined,
            transportFee,
          }
        : undefined,
    });

    closeNewAppointment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Agendamento de Atendimento
            </span>
            <h2 className="text-lg font-bold text-[#101010]">Novo Agendamento</h2>
          </div>
          <button
            onClick={closeNewAppointment}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Client & Pet Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Cliente (Tutor) *
              </label>
              <select
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              >
                <option value="">Selecione o tutor...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Animal de Estimação (Pet) *
              </label>
              <select
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                required
                disabled={!clientId || clientPets.length === 0}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden disabled:opacity-50"
              >
                {clientPets.length === 0 ? (
                  <option value="">Nenhum pet cadastrado para este tutor</option>
                ) : (
                  clientPets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} - {p.breed})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Service & Staff Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Serviço Solicitado *
              </label>
              <select
                value={serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · R$ {s.price.toFixed(2)} ({s.durationMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#222222]">
                  Profissional Responsável *
                </label>
                <button
                  type="button"
                  onClick={() => openTeamModal()}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B45309] hover:text-[#92400E] hover:underline"
                  title="Cadastrar novo veterinário ou funcionário com CRMV"
                >
                  <UserPlus className="h-3 w-3" />
                  <span>+ Novo Profissional</span>
                </button>
              </div>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden font-medium"
              >
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} {st.registration ? `· [${st.registration}]` : ''} — {st.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Data do Atendimento
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Duração Estimada
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              >
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>1 hora (60 min)</option>
                <option value={75}>1h 15 min</option>
                <option value={90}>1h 30 min</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
          </div>

          {/* Pricing & Payment row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F6F6F4] border border-[#E9E9E6]">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Valor do Serviço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-[#E9E9E6] bg-white px-3 py-2 text-xs font-bold text-[#101010] focus:border-[#FFC400] focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-white px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              >
                <option value="PIX">PIX</option>
                <option value="Cartão de crédito">Cartão de Crédito</option>
                <option value="Cartão de débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Transferência">Transferência Bancária</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Situação do Pagamento
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'Pago' | 'Pendente')}
                className="w-full rounded-lg border border-[#E9E9E6] bg-white px-3 py-2 text-xs font-semibold text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              >
                <option value="Pendente">Aguardando Pagamento</option>
                <option value="Pago">Já Pago / Concluído</option>
              </select>
            </div>
          </div>

          {/* Transport Logistics Section */}
          <div className="rounded-xl border border-[#E9E9E6] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#FFC400]" />
                <span className="text-xs font-bold text-[#101010]">
                  Serviço de Transporte (Leva e Traz / Táxi Dog)
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={transportEnabled}
                  onChange={(e) => setTransportEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#D3D3CE] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFC400]"></div>
              </label>
            </div>

            {transportEnabled && (
              <div className="pt-2 border-t border-[#E9E9E6] space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-[#555555] mb-1">
                      Modalidade de Transporte
                    </label>
                    <select
                      value={transportType}
                      onChange={(e) => setTransportType(e.target.value as TransportType)}
                      className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-2.5 py-1.5 text-xs text-[#222222]"
                    >
                      <option value="Leva e Traz Completo">Leva e Traz Completo (Ida e Volta)</option>
                      <option value="Busca">Apenas Buscar na Residência</option>
                      <option value="Entrega">Apenas Entregar na Residência</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#555555] mb-1">
                      Motorista Responsável
                    </label>
                    <select
                      value={transportDriver}
                      onChange={(e) => setTransportDriver(e.target.value)}
                      className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-2.5 py-1.5 text-xs text-[#222222]"
                    >
                      <option value="Marcos Vinicius">Marcos Vinicius (Van Climatizada 01)</option>
                      <option value="Equipe Externa">Frota de Apoio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#555555] mb-1">
                      Taxa de Deslocamento (R$)
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={transportFee}
                      onChange={(e) => setTransportFee(Number(e.target.value))}
                      className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#F2EFE5] text-[11px] text-[#777777]">
                  <span className="font-semibold text-[#444444]">Endereço de coleta: </span>
                  {selectedClient
                    ? `${selectedClient.address.street}, ${selectedClient.address.number} - ${selectedClient.address.neighborhood}, ${selectedClient.address.city}`
                    : 'Endereço não selecionado'}
                </div>
              </div>
            )}
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1.5">
              Observações & Recomendações do Tutor
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Não usar perfume, cuidado com orelha direita, tosa baixa nas patinhas..."
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] placeholder-[#999999] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
            <button
              type="button"
              onClick={closeNewAppointment}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
