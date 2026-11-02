/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldAlert,
  Award,
  Phone,
  Mail,
  CheckCircle2,
  Stethoscope,
  Scissors,
  Truck,
  Home,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffCategory, StaffMember } from '../../types';

export const TeamManagementModal: React.FC = () => {
  const {
    isTeamModalOpen,
    closeTeamModal,
    editingStaffMember,
    addStaff,
    updateStaff,
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<StaffCategory>('Veterinário');
  const [role, setRole] = useState('Médico(a) Veterinário(a) Clínico Geral');
  const [registration, setRegistration] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80');
  const [active, setActive] = useState(true);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  ];

  useEffect(() => {
    if (editingStaffMember) {
      setName(editingStaffMember.name);
      setCategory(editingStaffMember.category || 'Veterinário');
      setRole(editingStaffMember.role);
      setRegistration(editingStaffMember.registration || '');
      setPhone(editingStaffMember.phone);
      setEmail(editingStaffMember.email || '');
      setAvatar(editingStaffMember.avatar);
      setActive(editingStaffMember.active);
    } else {
      setName('');
      setCategory('Veterinário');
      setRole('Médico(a) Veterinário(a) Clínico Geral');
      setRegistration('');
      setPhone('');
      setEmail('');
      setAvatar(sampleAvatars[0]);
      setActive(true);
    }
  }, [editingStaffMember, isTeamModalOpen]);

  // Handle category presets for quick selection
  const handleCategoryChange = (cat: StaffCategory) => {
    setCategory(cat);
    if (cat === 'Veterinário' && !editingStaffMember) {
      setRole('Médico(a) Veterinário(a) Clínico Geral');
      if (!registration.startsWith('CRMV')) {
        setRegistration('CRMV-PR ');
      }
    } else if (cat === 'Estética' && !editingStaffMember) {
      setRole('Tosador(a) Master Groomer');
      setRegistration('REG-GMR ');
    } else if (cat === 'Logística' && !editingStaffMember) {
      setRole('Motorista Logística Táxi Dog');
      setRegistration('CNH-D ');
    } else if (cat === 'Hotel/Creche' && !editingStaffMember) {
      setRole('Monitor(a) de Creche & Hotel');
      setRegistration('MAT-');
    }
  };

  if (!isTeamModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStaffMember) {
      updateStaff({
        ...editingStaffMember,
        name: name.trim(),
        role: role.trim(),
        category,
        registration: registration.trim(),
        phone: phone.trim() || '(41) 99999-0000',
        email: email.trim() || undefined,
        avatar,
        active,
      });
    } else {
      addStaff({
        name: name.trim(),
        role: role.trim(),
        category,
        registration: registration.trim() || (category === 'Veterinário' ? 'CRMV-PR Pendente' : undefined),
        phone: phone.trim() || '(41) 99999-0000',
        email: email.trim() || undefined,
        avatar,
        active,
      });
    }

    closeTeamModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFC400]/20 text-[#101010]">
              <UserCheck className="h-5 w-5 text-[#B45309]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                Configuração de Equipe
              </span>
              <h2 className="text-base font-bold text-[#101010]">
                {editingStaffMember ? 'Editar Profissional / Veterinário' : 'Cadastrar Veterinário ou Funcionário'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={closeTeamModal}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          {/* Category Selector Tabs */}
          <div>
            <label className="block font-semibold text-[#222222] mb-1.5">
              Área de Atuação / Categoria *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('Veterinário')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition-all ${
                  category === 'Veterinário'
                    ? 'border-[#FFC400] bg-[#FFC400]/15 text-[#101010] shadow-xs'
                    : 'border-[#E9E9E6] bg-[#F6F6F4] text-[#666666] hover:bg-white'
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5 text-[#B45309]" />
                <span>Veterinário(a)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Estética')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition-all ${
                  category === 'Estética'
                    ? 'border-[#FFC400] bg-[#FFC400]/15 text-[#101010] shadow-xs'
                    : 'border-[#E9E9E6] bg-[#F6F6F4] text-[#666666] hover:bg-white'
                }`}
              >
                <Scissors className="h-3.5 w-3.5 text-[#101010]" />
                <span>Banho & Tosa</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Hotel/Creche')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition-all ${
                  category === 'Hotel/Creche'
                    ? 'border-[#FFC400] bg-[#FFC400]/15 text-[#101010] shadow-xs'
                    : 'border-[#E9E9E6] bg-[#F6F6F4] text-[#666666] hover:bg-white'
                }`}
              >
                <Home className="h-3.5 w-3.5 text-[#101010]" />
                <span>Hotel & Creche</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Logística')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition-all ${
                  category === 'Logística'
                    ? 'border-[#FFC400] bg-[#FFC400]/15 text-[#101010] shadow-xs'
                    : 'border-[#E9E9E6] bg-[#F6F6F4] text-[#666666] hover:bg-white'
                }`}
              >
                <Truck className="h-3.5 w-3.5 text-[#101010]" />
                <span>Táxi Dog</span>
              </button>
            </div>
          </div>

          {/* Name & CRMV/Registration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Nome Completo do Profissional *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={
                  category === 'Veterinário'
                    ? 'Ex: Drª. Renata Valente'
                    : 'Ex: Leonardo Silveira'
                }
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1 flex items-center justify-between">
                <span>Registro Profissional / CRMV *</span>
                {category === 'Veterinário' && (
                  <span className="text-[10px] text-[#B45309] font-bold">Obrigatório CRMV</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  placeholder={
                    category === 'Veterinário'
                      ? 'Ex: CRMV-PR 42819'
                      : 'Ex: REG-8891 ou Matrícula'
                  }
                  required={category === 'Veterinário'}
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] font-mono font-bold focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
                <Award className="absolute right-2.5 top-2.5 h-4 w-4 text-[#B45309] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Role & Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Função / Cargo Detalhado *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                placeholder="Ex: Médico(a) Veterinário(a) Clínico Geral"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Telefone / WhatsApp Direto *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(41) 99888-7766"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Email & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                E-mail Institucional (Opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profissional@levillepet.com.br"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Disponibilidade no Sistema
              </label>
              <div className="flex items-center gap-3 pt-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_radio"
                    checked={active}
                    onChange={() => setActive(true)}
                    className="accent-[#FFC400]"
                  />
                  <span className="text-xs font-semibold text-[#15803D]">Ativo na Escala</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_radio"
                    checked={!active}
                    onChange={() => setActive(false)}
                    className="accent-[#DC2626]"
                  />
                  <span className="text-xs font-semibold text-[#777777]">Inativo / Pausado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block font-semibold text-[#222222] mb-1.5">
              Foto de Perfil do Profissional
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
              {sampleAvatars.map((url, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setAvatar(url)}
                  className={`h-11 w-11 rounded-full overflow-hidden border-2 shrink-0 transition-transform ${
                    avatar === url
                      ? 'border-[#FFC400] scale-105 shadow-xs ring-2 ring-[#FFC400]/40'
                      : 'border-[#E9E9E6] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${i}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Informational Callout */}
          <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-3 text-xs text-[#92400E] flex items-start gap-2.5">
            <Award className="h-4 w-4 shrink-0 mt-0.5 text-[#B45309]" />
            <div>
              <span className="font-bold">Aparecerá automaticamente na seleção:</span>
              <p className="mt-0.5 text-[11px] text-[#78350F]">
                Ao salvar, o profissional com seu nome e CRMV/registro estará imediatamente disponível na lista de responsáveis da <strong>Agenda</strong>, <strong>Novo Agendamento</strong> e <strong>Histórico de Atendimentos</strong>.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
            <button
              type="button"
              onClick={closeTeamModal}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{editingStaffMember ? 'Salvar Alterações' : 'Confirmar Cadastro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
