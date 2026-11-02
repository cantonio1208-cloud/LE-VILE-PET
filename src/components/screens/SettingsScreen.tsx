/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Store,
  Users,
  CreditCard,
  ShieldCheck,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  UserPlus,
  X,
  AlertTriangle,
  Edit2,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const {
    staff,
    addStaff,
    removeStaff,
    openTeamModal,
    setCurrentScreen,
    managerProfile,
    updateManagerProfile,
    showToast,
  } = useApp();

  const [companyName, setCompanyName] = useState('Le Ville Pet Gestão & Spa Animal');
  const [cnpj, setCnpj] = useState('48.912.842/0001-90');
  const [phone, setPhone] = useState('(41) 3209-8810');
  const [whatsapp, setWhatsapp] = useState('(41) 99124-8831');
  const [email, setEmail] = useState('contato@levillepet.com.br');
  const [website, setWebsite] = useState('https://levillepet.com.br');
  const [address, setAddress] = useState('Rua Anne Frank, 1820 - Jardim das Américas, Curitiba - PR');
  const [openingHours, setOpeningHours] = useState('Segunda a Sábado: 08:00 às 19:00');
  const [transportBaseFee, setTransportBaseFee] = useState(35.0);
  const [pixKey, setPixKey] = useState('48.912.842/0001-90');

  // Manager profile local state
  const [managerName, setManagerName] = useState(managerProfile.name);
  const [managerRole, setManagerRole] = useState(managerProfile.role);
  const [managerBadge, setManagerBadge] = useState(managerProfile.badge);
  const [managerPhone, setManagerPhone] = useState(managerProfile.phone);
  const [managerEmail, setManagerEmail] = useState(managerProfile.email);
  const [managerAvatar, setManagerAvatar] = useState(managerProfile.avatar);

  // Modal / Form state for adding staff
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Tosador(a) Especialista');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffAvatar, setNewStaffAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  // Confirmation state for deleting staff
  const [staffToDelete, setStaffToDelete] = useState<{ id: string; name: string } | null>(null);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateManagerProfile({
      name: managerName.trim() || managerProfile.name,
      role: managerRole.trim() || managerProfile.role,
      badge: managerBadge.trim() || managerProfile.badge,
      phone: managerPhone.trim() || managerProfile.phone,
      email: managerEmail.trim() || managerProfile.email,
      avatar: managerAvatar,
    });
    showToast('Configurações e dados da gerente atualizados com sucesso!', 'success');
  };

  const handleSaveManagerOnly = () => {
    updateManagerProfile({
      name: managerName.trim() || managerProfile.name,
      role: managerRole.trim() || managerProfile.role,
      badge: managerBadge.trim() || managerProfile.badge,
      phone: managerPhone.trim() || managerProfile.phone,
      email: managerEmail.trim() || managerProfile.email,
      avatar: managerAvatar,
    });
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    addStaff({
      name: newStaffName.trim(),
      role: newStaffRole,
      phone: newStaffPhone.trim() || '(41) 99999-0000',
      avatar: newStaffAvatar,
      active: true,
    });

    // Reset form
    setNewStaffName('');
    setNewStaffPhone('');
    setIsAddStaffOpen(false);
  };

  const confirmDeleteStaff = () => {
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
      {/* Top Header */}
      <div className="rounded-2xl border border-[#E9E9E6] bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Parâmetros do Sistema
          </span>
          <h2 className="text-xl font-bold text-[#101010]">Configurações da Unidade</h2>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E9E6]">
            <Store className="h-4 w-4 text-[#FFC400]" />
            <h3 className="font-bold text-sm text-[#101010]">Dados Cadastrais da Empresa</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Razão Social / Nome Fantasia
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Telefone Fixo
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                WhatsApp Comercial
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block font-semibold text-[#222222] mb-1">
                Endereço Completo da Unidade
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Horário de Atendimento
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Site Oficial
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222]"
              />
            </div>
          </div>
        </div>

        {/* Manager Profile Section (Gerente Cadastrado no Sistema) */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E9E6]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFC400]/20 text-[#101010]">
                <ShieldCheck className="h-4.5 w-4.5 text-[#B45309]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#101010]">Perfil da Gerência Geral do Sistema</h3>
                <p className="text-xs text-[#777777]">
                  Dados exibidos no rodapé do menu lateral, cabeçalho e relatórios executivos
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D]">
              <span className="h-2 w-2 rounded-full bg-[#15803D]" />
              Usuário Ativo do Sistema
            </span>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-xl border border-[#242424] bg-[#141414] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={managerAvatar}
                  alt={managerName}
                  className="h-12 w-12 rounded-full border-2 border-[#FFC400] object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#141414] bg-[#15803D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{managerName || 'Nome da Gerente'}</span>
                  <span className="text-[10px] bg-[#FFC400]/20 text-[#FFC400] font-semibold px-2 py-0.5 rounded-full">
                    {managerBadge || 'Gerência Geral'}
                  </span>
                </div>
                <span className="text-xs text-[#A0A0A0] block mt-0.5 font-medium">
                  {managerRole || 'Cargo / CRMV'}
                </span>
                <span className="text-[11px] text-[#777777] font-mono block mt-0.5">
                  {managerEmail} · {managerPhone}
                </span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-[#2A2A2A] sm:pl-4">
              <span className="text-[11px] text-[#888888] block">Visualização em Tempo Real</span>
              <span className="text-xs text-[#FFC400] font-semibold">Exibido na Sidebar e Documentos</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Nome do(a) Gerente / Responsável Técnico *
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Ex: Drª. Camila Duarte"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Cargo / Registro Profissional (Exibido no Rodapé) *
              </label>
              <input
                type="text"
                value={managerRole}
                onChange={(e) => setManagerRole(e.target.value)}
                placeholder="Ex: CRMV-PR 42819 · Gestão"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                WhatsApp / Telefone Direto
              </label>
              <input
                type="text"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                placeholder="(41) 99122-3344"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                E-mail Institucional da Gerência
              </label>
              <input
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                placeholder="camila.duarte@levillepet.com.br"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block font-semibold text-[#222222] mb-1">
                Foto de Perfil da Gerente
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
                {sampleAvatars.map((url, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setManagerAvatar(url)}
                    className={`h-11 w-11 rounded-full overflow-hidden border-2 shrink-0 transition-transform ${
                      managerAvatar === url
                        ? 'border-[#FFC400] scale-105 shadow-xs ring-2 ring-[#FFC400]/40'
                        : 'border-[#E9E9E6] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar gerente ${i}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveManagerOnly}
              className="flex items-center gap-1.5 rounded-xl bg-[#101010] text-white px-4 py-2 text-xs font-bold hover:bg-[#222222] active:scale-98 transition-all"
            >
              <CheckCircle2 className="h-4 w-4 text-[#FFC400]" />
              <span>Salvar Dados da Gerente</span>
            </button>
          </div>
        </div>

        {/* Staff & Professionals Management */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E9E6]">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#FFC400]" />
              <div>
                <h3 className="font-bold text-sm text-[#101010]">Equipe & Profissionais</h3>
                <p className="text-xs text-[#777777]">
                  Gerencie médicos veterinários (CRMV), tosadores, banhistas e equipe de apoio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCurrentScreen('equipe')}
                className="flex items-center gap-1.5 rounded-xl border border-[#E9E9E6] bg-white px-3 py-2 text-xs font-semibold text-[#555555] hover:bg-[#F6F6F4] hover:text-[#101010] transition-colors"
              >
                <span>Tela Completa de Equipe</span>
              </button>
              <button
                type="button"
                onClick={() => openTeamModal()}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFC400] px-3.5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000] active:scale-98 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                <span>Adicionar Profissional / CRMV</span>
              </button>
            </div>
          </div>

          {/* Staff Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {staff.map((st) => (
              <div
                key={st.id}
                className="group relative p-3.5 rounded-xl border border-[#E9E9E6] bg-[#FAF9F8] flex items-center justify-between hover:border-[#CCCCCC] hover:bg-white transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="h-11 w-11 shrink-0 rounded-full object-cover border border-[#E9E9E6]"
                  />
                  <div className="text-xs truncate">
                    <span className="font-bold text-[#101010] block truncate">{st.name}</span>
                    <span className="text-[11px] text-[#777777] block truncate">{st.role}</span>
                    {st.registration && (
                      <span className="text-[10px] text-[#92400E] font-mono font-bold block bg-[#FEF3C7] px-1.5 py-0.5 rounded w-max mt-0.5">
                        {st.registration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openTeamModal(st)}
                    className="rounded-lg p-1.5 text-[#777777] hover:bg-[#F6F6F4] hover:text-[#101010] transition-colors"
                    title={`Editar ${st.name}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => setStaffToDelete({ id: st.id, name: st.name })}
                    className="rounded-lg p-1.5 text-[#888888] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                    title={`Excluir ${st.name} da equipe`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & PIX Settings */}
        <div className="rounded-2xl border border-[#E9E9E6] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E9E6]">
            <CreditCard className="h-4 w-4 text-[#FFC400]" />
            <h3 className="font-bold text-sm text-[#101010]">Configurações Financeiras & PIX</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Chave PIX Principal (CNPJ / Telefone)
              </label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#222222] mb-1">
                Taxa Padrão de Transporte Táxi Dog (R$)
              </label>
              <input
                type="number"
                value={transportBaseFee}
                onChange={(e) => setTransportBaseFee(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] font-mono font-bold"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Modal: Adicionar Profissional */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFC400]/20 text-[#101010]">
                  <UserPlus className="h-4 w-4 text-[#B45309]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                    Quadro de Funcionários
                  </span>
                  <h3 className="text-base font-bold text-[#101010]">Cadastrar Novo Profissional</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#222222] mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  required
                  placeholder="Ex: Gabriel Silveira, Juliana Castro..."
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#222222] mb-1">
                  Cargo / Especialidade *
                </label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
                >
                  <option value="Tosador(a) Master Groomer">Tosador(a) Master Groomer</option>
                  <option value="Tosador(a) Especialista">Tosador(a) Especialista</option>
                  <option value="Banhista Especialista & Spa">Banhista Especialista & Spa</option>
                  <option value="Veterinário(a) Clínico Geral">Veterinário(a) Clínico Geral</option>
                  <option value="Motorista Logística Táxi Dog">Motorista Logística Táxi Dog</option>
                  <option value="Monitor(a) de Creche & Hotel">Monitor(a) de Creche & Hotel</option>
                  <option value="Atendente & Recepção">Atendente & Recepção</option>
                  <option value="Gerente Operacional">Gerente Operacional</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#222222] mb-1">
                  Telefone / WhatsApp de Contato
                </label>
                <input
                  type="text"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="(41) 99999-8888"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#222222] mb-1">
                  Escolha uma Foto de Perfil
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                  {sampleAvatars.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setNewStaffAvatar(url)}
                      className={`h-11 w-11 rounded-full overflow-hidden border-2 shrink-0 transition-transform ${
                        newStaffAvatar === url
                          ? 'border-[#FFC400] scale-105 shadow-xs'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
                >
                  Cadastrar Profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Exclusão de Profissional */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] p-6 text-center animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#101010]">Excluir Profissional?</h3>
              <p className="text-xs text-[#555555] mt-1.5 leading-relaxed">
                Tem certeza que deseja remover <strong>{staffToDelete.name}</strong> da equipe? Esta ação não pode ser desfeita.
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
                onClick={confirmDeleteStaff}
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
