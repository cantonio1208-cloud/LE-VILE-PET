/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Dog, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PetSpecies, PetSize, PetSex } from '../../types';

export const NewPetModal: React.FC = () => {
  const { isNewPetOpen, closeNewPet, prefilledPetClient, clients, addPet } = useApp();

  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('Cão');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState<PetSize>('Pequeno');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState<number>(5.0);
  const [sex, setSex] = useState<PetSex>('Macho');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [specialCare, setSpecialCare] = useState('');
  const [allergies, setAllergies] = useState('');
  const [microchip, setMicrochip] = useState('');

  // Default suggested royalty-free dog/cat photos
  const samplePhotos = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
  ];

  useEffect(() => {
    if (isNewPetOpen) {
      setClientId(prefilledPetClient || (clients.length > 0 ? clients[0].id : ''));
      setPhotoUrl(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
    }
  }, [isNewPetOpen, prefilledPetClient, clients]);

  if (!isNewPetOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientId || !breed) return;

    addPet({
      clientId,
      name,
      species,
      breed,
      size,
      age: age || '1 ano',
      weight: Number(weight) || 5.0,
      sex,
      photoUrl: photoUrl || samplePhotos[0],
      notes: notes || 'Animal sociável e dócil.',
      specialCare: specialCare || 'Nenhum cuidado especial relatado.',
      allergies: allergies || 'Nenhuma alergia relatada.',
      microchip: microchip || undefined,
      vaccines: [
        {
          name: 'V10 / Quíntupla',
          date: '2026-03-01',
          validUntil: '2027-03-01',
          status: 'Em dia',
        },
        {
          name: 'Antirrábica',
          date: '2026-03-01',
          validUntil: '2027-03-01',
          status: 'Em dia',
        },
      ],
      active: true,
    });

    closeNewPet();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E9E9E6] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E9E9E6] px-6 py-4 bg-[#FBFBFA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Módulo de Animais
            </span>
            <h2 className="text-lg font-bold text-[#101010]">Cadastrar Novo Pet</h2>
          </div>
          <button
            onClick={closeNewPet}
            className="rounded-lg p-1.5 text-[#777777] hover:bg-[#E9E9E6] hover:text-[#101010] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Tutor Assignment */}
          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1">
              Tutor Responsável *
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
            >
              <option value="">Selecione o tutor...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Pet Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Nome do Animal *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Thor, Luna, Bob"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Espécie *
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              >
                <option value="Cão">Cão (Canino)</option>
                <option value="Gato">Gato (Felino)</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Raça *
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
                placeholder="Ex: Golden Retriever, Shih Tzu, SRD"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Porte do Animal
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as PetSize)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              >
                <option value="Pequeno">Pequeno (até 10kg)</option>
                <option value="Médio">Médio (11kg a 25kg)</option>
                <option value="Grande">Grande (26kg a 45kg)</option>
                <option value="Gigante">Gigante (+45kg)</option>
              </select>
            </div>
          </div>

          {/* Age, Weight, Sex */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Idade
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 2 anos"
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs font-mono text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Sexo
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as PetSex)}
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>

          {/* Photo & Microchip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                URL da Foto
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Número do Microchip
              </label>
              <input
                type="text"
                value={microchip}
                onChange={(e) => setMicrochip(e.target.value)}
                placeholder="98109810..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Medical & Special Care */}
          <div className="space-y-3 pt-3 border-t border-[#E9E9E6]">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-[#DC2626]" />
                <span>Cuidados Especiais & Restrições Físicas</span>
              </label>
              <input
                type="text"
                value={specialCare}
                onChange={(e) => setSpecialCare(e.target.value)}
                placeholder="Ex: Secagem lenta nas orelhas, displasia, piso antiderrapante..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-[#B45309]" />
                <span>Alergias Conhecidas</span>
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ex: Alérgico a frango, shampoo cítrico ou picada de pulga..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Temperamento & Observações de Manejo
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comportamento com outros animais, tolerância ao secador, petiscos favoritos..."
                className="w-full rounded-lg border border-[#E9E9E6] bg-[#F6F6F4] px-3 py-2 text-xs text-[#222222] focus:border-[#FFC400] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E9E6]">
            <button
              type="button"
              onClick={closeNewPet}
              className="rounded-lg px-4 py-2 text-xs font-medium text-[#555555] hover:bg-[#F6F6F4]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#FFC400] px-5 py-2 text-xs font-bold text-[#101010] shadow-xs hover:bg-[#E5B000]"
            >
              Salvar Ficha do Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
