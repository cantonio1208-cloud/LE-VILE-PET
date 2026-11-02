/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Stethoscope,
  Scissors,
  Home,
  Truck,
  Award,
  Search,
  Phone,
  Mail,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffCategory, StaffMember } from '../../types';

export const TeamScreen: React.FC = () => {
  const {
    staff,
    removeStaff,
    toggleStaffActive,
    openTeamModal,
    appointments,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Filter staff
  const filteredStaff = staff.filter((member) => {
    // Category filter
    if (selectedCategory !== 'all' && member.category !== selectedCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = member.name.toLowerCase().includes(q);
      const matchRole = member.role.toLowerCase().includes(q);
      const matchReg = member.registration?.toLowerCase().includes(q);
      const matchPhone = member.phone.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchReg && !matchPhone) {
        return false;
      }
    }

    return true;
  });

  // Calculate metrics
  const totalStaff = staff.length;
  const vetsCount = staff.filter((s) => s.category === 'Veterinário').length;
  const groomersCount = staff.filter((s) => s.category === 'Estética').length;
  const logisticsCount = staff.filter((s) => s.category === 'Logística').length;

  const confirmDelete = () => {
    if (!staffToDelete) return;
    if (staff.length <= 1) {
      showToast('É necessário manter ao menos um profissional cadastrado no sistema.', 'warning');
      setStaffToDelete(null);
      return;
    }
    removeStaff(staffToDelete.id);
    setStaffToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Main Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Gestão de Pessoas & Corpo Clínico
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFC400]" />
            <span className="text-[11px] font-semibold text-[#15803D]">
              Disponíveis para Agendamentos
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#101010]">Configuração de Equipe & Veterinários</h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Cadastre médicos veterinários com registro CRMV e funcionários para vinculação direta em serviços e atendimentos.
          </p>
        </div>

        <button
          onClick={() => openTeamModal()}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FFC400] px-5 py-2.5 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Cadastrar Profissional / CRMV</span>
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#777777] mb-1">
            <span className="text-xs font-semibold">Total da Equipe</span>
            <Users className="h-4 w-4 text-[#FFC400]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-[#101010]">{totalStaff}</span>
            <span className="text-[11px] text-[#15803D] font-bold">Cadastrados</span>
          </div>
          <span className="text-[11px] text-[#777777] block mt-1">
            {staff.filter((s) => s.active).length} ativos na escala
          </span>
        </div>

        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#777777] mb-1">
            <span className="text-xs font-semibold">Médicos Veterinários</span>
            <Stethoscope className="h-4 w-4 text-[#B45309]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-[#101010]">{vetsCount}</span>
            <span className="text-[11px] text-[#B45309] font-bold font-mono">Com CRMV</span>
          </div>
          <span className="text-[11px] text-[#777777] block mt-1">
            Responsáveis técnicos clínicos
          </span>
        </div>

        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#777777] mb-1">
            <span className="text-xs font-semibold">Estética & Grooming</span>
            <Scissors className="h-4 w-4 text-[#101010]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-[#101010]">{groomersCount}</span>
            <span className="text-[11px] text-[#777777]">Especialistas</span>
          </div>
          <span className="text-[11px] text-[#777777] block mt-1">
            Banho, tosa na tesoura e spa
          </span>
        </div>

        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#777777] mb-1">
            <span className="text-xs font-semibold">Logística & Hotel</span>
            <Truck className="h-4 w-4 text-[#101010]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-[#101010]">
              {logisticsCount + staff.filter((s) => s.category === 'Hotel/Creche').length}
            </span>
            <span className="text-[11px] text-[#777777]">Apoio</span>
          </div>
          <span className="text-[11px] text-[#777777] block mt-1">
            Táxi Dog e recreação
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#101010] text-white shadow-xs'
                  : 'bg-[#F6F6F4] text-[#555555] hover:bg-[#E9E9E6]'
              }`}
            >
              Todos ({staff.length})
            </button>
            <button
              onClick={() => setSelectedCategory('Veterinário')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === 'Veterinário'
                  ? 'bg-[#FFC400] text-[#101010] font-bold shadow-xs'
                  : 'bg-[#F6F6F4] text-[#555555] hover:bg-[#E9E9E6]'
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Veterinários ({vetsCount})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('Estética')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === 'Estética'
                  ? 'bg-[#101010] text-white shadow-xs'
                  : 'bg-[#F6F6F4] text-[#555555] hover:bg-[#E9E9E6]'
              }`}
            >
              <Scissors className="h-3.5 w-3.5" />
              <span>Estética & Spa ({groomersCount})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('Logística')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === 'Logística'
                  ? 'bg-[#101010] text-white shadow-xs'
                  : 'bg-[#F6F6F4] text-[#555555] hover:bg-[#E9E9E6]'
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Logística ({logisticsCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777777]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, CRMV ou cargo..."
              className="w-full rounded-xl border border-[#E9E9E6] bg-[#F6F6F4] pl-9 pr-3 py-1.5 text-xs text-[#222222] placeholder-[#999999] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => {
          const assignedCount = appointments.filter((a) => a.staffId === member.id).length;
          const isVet = member.category === 'Veterinário';

          return (
            <div
              key={member.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                member.active
                  ? 'bg-white border-[#E9E9E6] hover:border-[#CCCCCC]'
                  : 'bg-[#F9F9F8] border-[#E9E9E6] opacity-75'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className={`h-12 w-12 rounded-full object-cover border-2 ${
                          isVet ? 'border-[#FFC400]' : 'border-[#E9E9E6]'
                        }`}
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          member.active ? 'bg-[#15803D]' : 'bg-[#DC2626]'
                        }`}
                        title={member.active ? 'Ativo na escala' : 'Inativo'}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-[#101010] truncate">
                          {member.name}
                        </h3>
                      </div>
                      <span className="text-xs text-[#555555] block truncate font-medium">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Actions Dropdown / Quick Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openTeamModal(member)}
                      className="p-1.5 rounded-lg text-[#777777] hover:bg-[#F6F6F4] hover:text-[#101010] transition-colors"
                      title="Editar profissional e CRMV"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setStaffToDelete(member)}
                      className="p-1.5 rounded-lg text-[#888888] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                      title="Excluir profissional"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Professional Registration Badge */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  {member.registration ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                        isVet
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                          : 'bg-[#F4F4F2] text-[#333333] border border-[#E5E5E0]'
                      }`}
                    >
                      <Award className="h-3.5 w-3.5 shrink-0" />
                      <span>{member.registration}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#F4F4F2] text-[#888888]">
                      Sem registro cadastrado
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F6F6F4] text-[#666666]">
                    {member.category || 'Colaborador'}
                  </span>
                </div>

                {/* Contact info */}
                <div className="mt-3.5 space-y-1.5 text-xs text-[#555555] pt-3 border-t border-[#F2F2EE]">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#777777]" />
                    <span className="font-mono">{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-[#777777]" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Operational Status & Atendimentos count */}
              <div className="mt-4 pt-3 border-t border-[#F2F2EE] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#777777]">
                  <Calendar className="h-3.5 w-3.5 text-[#FFC400]" />
                  <span>
                    <strong className="text-[#101010]">{assignedCount}</strong> atendimentos
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStaffActive(member.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                    member.active
                      ? 'bg-[#15803D]/10 text-[#15803D] hover:bg-[#15803D]/20'
                      : 'bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20'
                  }`}
                >
                  {member.active ? 'Ativo na Escala' : 'Pausado'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStaff.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E9E9E6] bg-white p-12 text-center">
          <UserCheck className="mx-auto h-12 w-12 text-[#CCCCCC]" />
          <h3 className="mt-3 text-base font-bold text-[#101010]">
            Nenhum profissional encontrado
          </h3>
          <p className="mt-1 text-xs text-[#777777]">
            Tente buscar com outro termo ou cadastre um novo membro da equipe.
          </p>
          <button
            onClick={() => openTeamModal()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FFC400] px-4 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
          >
            <UserPlus className="h-4 w-4" />
            <span>Cadastrar Novo Profissional</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] p-6 text-center animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#101010]">Excluir Profissional?</h3>
              <p className="text-xs text-[#555555] mt-1.5 leading-relaxed">
                Tem certeza que deseja remover <strong>{staffToDelete.name}</strong>{' '}
                {staffToDelete.registration ? `(${staffToDelete.registration})` : ''} da equipe?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="rounded-lg border border-[#E9E9E6] px-4 py-2 text-xs font-semibold text-[#555555] hover:bg-[#F6F6F4]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-bold text-white hover:bg-[#B91C1C] shadow-xs"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
