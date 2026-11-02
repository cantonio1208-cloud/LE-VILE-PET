/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, UserPlus, MapPin, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewClientModal: React.FC = () => {
  const { isNewClientOpen, closeNewClient, addClient, openNewPet } = useApp();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Curitiba');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');
  const [createPetNow, setCreatePetNow] = useState(true);

  if (!isNewClientOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newClientId = addClient({
      name,
      cpf: cpf || 'Não informado',
      phone,
      whatsapp: whatsapp || phone.replace(/\D/g, ''),
      email: email || 'contato@cliente.com',
      address: {
        street: street || 'Rua Principal',
        number: number || 'S/N',
        complement,
        neighborhood: neighborhood || 'Centro',
        city: city || 'Curitiba',
        zipCode: zipCode || '80000-000',
      },
      notes,
      active: true,
    });

    closeNewClient();

    if (createPetNow) {
      setTimeout(() => {
        openNewPet(newClientId);
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Módulo de Clientes
            </span>
            <h2 className="text-lg font-bold text-[#101010]">Cadastrar Novo Tutor</h2>
          </div>
          <button
            onClick={closeNewClient}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#777777] tracking-wider">
              Dados Pessoais
            </h3>
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Nome Completo do Tutor *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Mariana Oliveira"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  Telefone de Contato *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="(41) 99999-8888"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  WhatsApp (com DDD)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="5541999998888"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3 pt-3 border-t border-[#E9E9E6]">
            <h3 className="text-xs font-bold uppercase text-[#777777] tracking-wider">
              Endereço para Transporte (Táxi Dog)
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  Logradouro / Rua
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua das Palmeiras"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  Número
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Batel"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 101"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="80000-000"
                  className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1">
              Observações Gerais do Tutor
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferências de contato, horários de disponibilidade..."
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FAF9F5] border border-[#F2EFE5]">
            <input
              type="checkbox"
              id="createPetCheck"
              checked={createPetNow}
              onChange={(e) => setCreatePetNow(e.target.checked)}
              className="h-4 w-4 rounded accent-[#FFC400]"
            />
            <label htmlFor="createPetCheck" className="text-xs font-medium text-[#222222] cursor-pointer">
              Abrir formulário de cadastro de animal (Pet) logo após salvar
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
            <button
              type="button"
              onClick={closeNewClient}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
