/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  ScreenId,
  Client,
  Pet,
  ServiceItem,
  Appointment,
  HotelBooking,
  Invoice,
  StaffMember,
  ManagerProfile,
  AppointmentStatus,
  TransportStatus,
  HotelStatus,
  PaymentMethod,
  AppNotification,
} from '../types';
import {
  initialClients,
  initialPets,
  initialServices,
  initialStaff,
  initialAppointments,
  initialHotelBookings,
  initialInvoices,
  initialManagerProfile,
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedPetId: string | null;
  setSelectedPetId: (id: string | null) => void;
  selectedAppointmentId: string | null;
  setSelectedAppointmentId: (id: string | null) => void;

  // Data Collections
  clients: Client[];
  pets: Pet[];
  services: ServiceItem[];
  staff: StaffMember[];
  appointments: Appointment[];
  hotelBookings: HotelBooking[];
  invoices: Invoice[];

  // Helper getters
  getClientById: (id: string) => Client | undefined;
  getPetById: (id: string) => Pet | undefined;
  getServiceById: (id: string) => ServiceItem | undefined;
  getPetsByClientId: (clientId: string) => Pet[];
  getAppointmentsByPetId: (petId: string) => Appointment[];
  getAppointmentsByClientId: (clientId: string) => Appointment[];
  getInvoicesByClientId: (clientId: string) => Invoice[];
  getInvoicesByPetId: (petId: string) => Invoice[];
  getHotelBookingsByPetId: (petId: string) => HotelBooking[];

  // Modals
  isNewAppointmentOpen: boolean;
  openNewAppointment: (prefilledClientId?: string, prefilledPetId?: string) => void;
  closeNewAppointment: () => void;
  prefilledAppointmentClient: string | null;
  prefilledAppointmentPet: string | null;

  isNewClientOpen: boolean;
  openNewClient: () => void;
  closeNewClient: () => void;

  isNewPetOpen: boolean;
  openNewPet: (prefilledClientId?: string) => void;
  closeNewPet: () => void;
  prefilledPetClient: string | null;

  isRegisterPaymentOpen: boolean;
  paymentTargetInvoice: Invoice | null;
  openRegisterPayment: (invoice?: Invoice) => void;
  closeRegisterPayment: () => void;

  isNewHotelBookingOpen: boolean;
  openNewHotelBooking: () => void;
  closeNewHotelBooking: () => void;

  isNewServiceOpen: boolean;
  openNewService: () => void;
  closeNewService: () => void;

  isTeamModalOpen: boolean;
  editingStaffMember: StaffMember | null;
  openTeamModal: (member?: StaffMember) => void;
  closeTeamModal: () => void;

  // Mutations
  addClient: (clientData: Omit<Client, 'id' | 'registeredAt'>) => string;
  updateClient: (client: Client) => void;
  addPet: (petData: Omit<Pet, 'id'>) => string;
  updatePet: (pet: Pet) => void;
  addAppointment: (aptData: Omit<Appointment, 'id'>) => string;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateTransportStatus: (appointmentId: string, status: TransportStatus) => void;
  addHotelBooking: (bookingData: Omit<HotelBooking, 'id'>) => string;
  updateHotelStatus: (id: string, status: HotelStatus) => void;
  addService: (serviceData: Omit<ServiceItem, 'id'>) => string;
  toggleServiceActive: (id: string) => void;
  addStaff: (staffData: Omit<StaffMember, 'id'>) => string;
  updateStaff: (staffData: StaffMember) => void;
  toggleStaffActive: (id: string) => void;
  removeStaff: (id: string) => void;
  recordPayment: (invoiceId: string, amount: number, method: PaymentMethod) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Manager Profile
  managerProfile: ManagerProfile;
  updateManagerProfile: (updated: Partial<ManagerProfile>) => void;

  // Global search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // In-App Notification System
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  handleNotificationAction: (notification: AppNotification) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Data states
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>(initialHotelBookings);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [managerProfile, setManagerProfile] = useState<ManagerProfile>(initialManagerProfile);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [prefilledAppointmentClient, setPrefilledAppointmentClient] = useState<string | null>(null);
  const [prefilledAppointmentPet, setPrefilledAppointmentPet] = useState<string | null>(null);

  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewPetOpen, setIsNewPetOpen] = useState(false);
  const [prefilledPetClient, setPrefilledPetClient] = useState<string | null>(null);

  const [isRegisterPaymentOpen, setIsRegisterPaymentOpen] = useState(false);
  const [paymentTargetInvoice, setPaymentTargetInvoice] = useState<Invoice | null>(null);

  const [isNewHotelBookingOpen, setIsNewHotelBookingOpen] = useState(false);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper getters
  const getClientById = (id: string) => clients.find((c) => c.id === id);
  const getPetById = (id: string) => pets.find((p) => p.id === id);
  const getServiceById = (id: string) => services.find((s) => s.id === id);
  const getPetsByClientId = (clientId: string) => pets.filter((p) => p.clientId === clientId);
  const getAppointmentsByPetId = (petId: string) =>
    appointments.filter((a) => a.petId === petId).sort((a, b) => b.date.localeCompare(a.date));
  const getAppointmentsByClientId = (clientId: string) =>
    appointments.filter((a) => a.clientId === clientId).sort((a, b) => b.date.localeCompare(a.date));
  const getInvoicesByClientId = (clientId: string) =>
    invoices.filter((i) => i.clientId === clientId).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const getInvoicesByPetId = (petId: string) =>
    invoices.filter((i) => i.petId === petId).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const getHotelBookingsByPetId = (petId: string) =>
    hotelBookings.filter((h) => h.petId === petId).sort((a, b) => b.checkInDate.localeCompare(a.checkInDate));

  // Modal openers
  const openNewAppointment = (prefilledClientId?: string, prefilledPetId?: string) => {
    setPrefilledAppointmentClient(prefilledClientId || null);
    setPrefilledAppointmentPet(prefilledPetId || null);
    setIsNewAppointmentOpen(true);
  };
  const closeNewAppointment = () => {
    setIsNewAppointmentOpen(false);
    setPrefilledAppointmentClient(null);
    setPrefilledAppointmentPet(null);
  };

  const openNewClient = () => setIsNewClientOpen(true);
  const closeNewClient = () => setIsNewClientOpen(false);

  const openNewPet = (prefilledClientId?: string) => {
    setPrefilledPetClient(prefilledClientId || null);
    setIsNewPetOpen(true);
  };
  const closeNewPet = () => {
    setIsNewPetOpen(false);
    setPrefilledPetClient(null);
  };

  const openRegisterPayment = (invoice?: Invoice) => {
    setPaymentTargetInvoice(invoice || null);
    setIsRegisterPaymentOpen(true);
  };
  const closeRegisterPayment = () => {
    setIsRegisterPaymentOpen(false);
    setPaymentTargetInvoice(null);
  };

  const openNewHotelBooking = () => setIsNewHotelBookingOpen(true);
  const closeNewHotelBooking = () => setIsNewHotelBookingOpen(false);

  const openNewService = () => setIsNewServiceOpen(true);
  const closeNewService = () => setIsNewServiceOpen(false);

  const openTeamModal = (member?: StaffMember) => {
    setEditingStaffMember(member || null);
    setIsTeamModalOpen(true);
  };
  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
    setEditingStaffMember(null);
  };

  // Mutations
  const addClient = (clientData: Omit<Client, 'id' | 'registeredAt'>) => {
    const id = `cli-${String(clients.length + 1).padStart(2, '0')}`;
    const newClient: Client = {
      ...clientData,
      id,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Cliente ${newClient.name} cadastrado com sucesso!`);
    return id;
  };

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast(`Cadastro de ${updated.name} atualizado.`);
  };

  const addPet = (petData: Omit<Pet, 'id'>) => {
    const id = `pet-${String(pets.length + 1).padStart(2, '0')}`;
    const newPet: Pet = {
      ...petData,
      id,
    };
    setPets((prev) => [newPet, ...prev]);
    showToast(`Animal ${newPet.name} cadastrado com sucesso!`);
    return id;
  };

  const updatePet = (updated: Pet) => {
    setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Ficha de ${updated.name} atualizada.`);
  };

  const addAppointment = (aptData: Omit<Appointment, 'id'>) => {
    const id = `apt-${String(appointments.length + 1).padStart(2, '0')}`;
    const newApt: Appointment = {
      ...aptData,
      id,
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Also generate an invoice automatically
    const pet = getPetById(aptData.petId);
    const service = getServiceById(aptData.serviceId);
    const serviceTitle = `${service?.name || 'Atendimento'} ${aptData.transport?.enabled ? '+ Transporte' : ''}`;
    const totalAmount = aptData.amount + (aptData.transport?.transportFee || 0);

    const isPaid = aptData.paymentStatus === 'Pago';
    const newInvoice: Invoice = {
      id: `inv-${String(invoices.length + 1).padStart(2, '0')}`,
      clientId: aptData.clientId,
      petId: aptData.petId,
      serviceTitle,
      appointmentId: id,
      invoiceDate: aptData.date,
      dueDate: aptData.date,
      amount: totalAmount,
      amountPaid: isPaid ? totalAmount : 0,
      balanceDue: isPaid ? 0 : totalAmount,
      paymentMethod: aptData.paymentMethod,
      status: aptData.paymentStatus,
      paidAt: isPaid ? `${aptData.date} ${aptData.time}` : undefined,
      receiptNumber: `REC-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    showToast(`Agendamento de ${pet?.name || 'Pet'} agendado para ${aptData.date} às ${aptData.time}!`);
    return id;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Status do agendamento atualizado para "${status}".`);
  };

  const updateTransportStatus = (appointmentId: string, status: TransportStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === appointmentId && a.transport) {
          return {
            ...a,
            transport: {
              ...a.transport,
              status,
            },
          };
        }
        return a;
      })
    );
    showToast(`Status de transporte atualizado para "${status}".`);
  };

  const addHotelBooking = (bookingData: Omit<HotelBooking, 'id'>) => {
    const id = `hot-${String(hotelBookings.length + 1).padStart(2, '0')}`;
    const newBooking: HotelBooking = {
      ...bookingData,
      id,
    };
    setHotelBookings((prev) => [newBooking, ...prev]);

    // Create invoice
    const pet = getPetById(bookingData.petId);
    const newInvoice: Invoice = {
      id: `inv-${String(invoices.length + 1).padStart(2, '0')}`,
      clientId: bookingData.clientId,
      petId: bookingData.petId,
      serviceTitle: `${bookingData.category} - ${bookingData.suiteName} (${bookingData.daysCount} diárias)`,
      hotelBookingId: id,
      invoiceDate: bookingData.checkInDate,
      dueDate: bookingData.checkInDate,
      amount: bookingData.totalAmount,
      amountPaid: bookingData.paymentStatus === 'Pago' ? bookingData.totalAmount : 0,
      balanceDue: bookingData.paymentStatus === 'Pago' ? 0 : bookingData.totalAmount,
      paymentMethod: 'PIX',
      status: bookingData.paymentStatus,
      paidAt: bookingData.paymentStatus === 'Pago' ? `${bookingData.checkInDate} 10:00` : undefined,
      receiptNumber: `REC-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    showToast(`Hospedagem de ${pet?.name || 'Pet'} reservada com sucesso!`);
    return id;
  };

  const updateHotelStatus = (id: string, status: HotelStatus) => {
    setHotelBookings((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status } : h))
    );
    showToast(`Status da hospedagem atualizado para "${status}".`);
  };

  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const id = `serv-${String(services.length + 1).padStart(2, '0')}`;
    const newService: ServiceItem = {
      ...serviceData,
      id,
    };
    setServices((prev) => [...prev, newService]);
    showToast(`Serviço "${newService.name}" cadastrado!`);
    return id;
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    showToast(`Disponibilidade do serviço alterada.`);
  };

  const recordPayment = (invoiceId: string, paidAddition: number, method: PaymentMethod) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;

        const newAmountPaid = Math.min(inv.amount, inv.amountPaid + paidAddition);
        const newBalanceDue = Math.max(0, inv.amount - newAmountPaid);
        const newStatus = newBalanceDue === 0 ? 'Pago' : 'Parcial';
        const now = new Date();
        const paidAt = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        return {
          ...inv,
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue,
          paymentMethod: method,
          status: newStatus,
          paidAt: newStatus === 'Pago' ? paidAt : inv.paidAt,
        };
      })
    );

    // Also sync appointment payment status if linked
    const targetInvoice = invoices.find((i) => i.id === invoiceId);
    if (targetInvoice?.appointmentId) {
      setAppointments((prev) =>
        prev.map((a) => {
          if (a.id === targetInvoice.appointmentId) {
            const willBePaid = (targetInvoice.amountPaid + paidAddition) >= targetInvoice.amount;
            return {
              ...a,
              paymentStatus: willBePaid ? 'Pago' : 'Parcial',
              paymentMethod: method,
            };
          }
          return a;
        })
      );
    }

    showToast(`Pagamento de R$ ${paidAddition.toFixed(2)} registrado com sucesso!`, 'success');
  };

  const addStaff = (staffData: Omit<StaffMember, 'id'>) => {
    const id = `st-${String(staff.length + 1).padStart(2, '0')}`;
    const newMember: StaffMember = {
      ...staffData,
      id,
    };
    setStaff((prev) => [...prev, newMember]);
    showToast(`Profissional ${newMember.name} cadastrado(a) com sucesso!`, 'success');
    return id;
  };

  const updateStaff = (updated: StaffMember) => {
    setStaff((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Cadastro de ${updated.name} atualizado com sucesso!`, 'success');
  };

  const toggleStaffActive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = !s.active;
          showToast(`Status de ${s.name} alterado para ${newStatus ? 'Ativo' : 'Inativo'}.`);
          return { ...s, active: newStatus };
        }
        return s;
      })
    );
  };

  const removeStaff = (id: string) => {
    const member = staff.find((s) => s.id === id);
    setStaff((prev) => prev.filter((s) => s.id !== id));
    showToast(`Profissional ${member?.name || ''} removido(a) da equipe.`, 'info');
  };

  const updateManagerProfile = (updated: Partial<ManagerProfile>) => {
    setManagerProfile((prev) => ({ ...prev, ...updated }));
    showToast('Dados da gerência atualizados com sucesso!', 'success');
  };

  // Notification System State
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Compute active notifications dynamically from operational state
  const notifications = useMemo<AppNotification[]>(() => {
    const list: AppNotification[] = [];
    const currentDate = '2026-11-02';

    // 1. Agendamentos Próximos (Hoje: 2026-11-02, ainda não concluídos ou cancelados)
    appointments
      .filter((a) => a.date === currentDate && a.status !== 'Concluído' && a.status !== 'Cancelado')
      .sort((a, b) => a.time.localeCompare(b.time))
      .forEach((apt) => {
        const id = `notif-apt-${apt.id}`;
        if (dismissedNotificationIds.includes(id)) return;

        const pet = pets.find((p) => p.id === apt.petId);
        const client = clients.find((c) => c.id === apt.clientId);
        const service = services.find((s) => s.id === apt.serviceId);

        list.push({
          id,
          type: 'agendamento',
          title: `Agendamento: ${pet?.name || 'Pet'} às ${apt.time}`,
          message: `${service?.name || 'Atendimento'} (${apt.durationMinutes} min) com ${apt.staffName}. Tutor: ${client?.name || 'Cliente'}. Status: ${apt.status}.`,
          timestamp: `Hoje às ${apt.time}`,
          date: apt.date,
          read: readNotificationIds.includes(id),
          severity: apt.status === 'Em andamento' ? 'alerta' : 'info',
          targetScreen: 'agenda',
          targetId: apt.id,
          actionLabel: 'Ver Agendamento',
          meta: {
            petName: pet?.name,
            clientName: client?.name,
            time: apt.time,
          },
        });
      });

    // 2. Pets com Vacinas Vencidas ou Vencendo
    pets.forEach((pet) => {
      if (!pet.active) return;
      const client = clients.find((c) => c.id === pet.clientId);

      pet.vaccines.forEach((v) => {
        const isExpired = v.status === 'Vencida' || v.validUntil < currentDate;
        const isExpiringSoon =
          !isExpired &&
          (v.status === 'Pendente' ||
            (v.validUntil >= currentDate && v.validUntil <= '2026-12-05'));

        if (isExpired) {
          const id = `notif-vac-exp-${pet.id}-${v.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          if (!dismissedNotificationIds.includes(id)) {
            list.push({
              id,
              type: 'vacina',
              title: `Vacina Vencida: ${pet.name}`,
              message: `A dose de ${v.name} do animal ${pet.name} (${pet.breed}) expirou em ${v.validUntil}. Entre em contato com ${client?.name || 'o tutor'} para reforço vacinal.`,
              timestamp: `Vencida em ${v.validUntil}`,
              date: v.validUntil,
              read: readNotificationIds.includes(id),
              severity: 'urgente',
              targetScreen: 'pets',
              targetId: pet.id,
              actionLabel: 'Ver Ficha do Pet',
              meta: {
                petName: pet.name,
                clientName: client?.name,
                vaccineName: v.name,
              },
            });
          }
        } else if (isExpiringSoon) {
          const id = `notif-vac-soon-${pet.id}-${v.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          if (!dismissedNotificationIds.includes(id)) {
            list.push({
              id,
              type: 'vacina',
              title: `Vacina Vencendo: ${pet.name}`,
              message: `A vacina ${v.name} do pet ${pet.name} vence em ${v.validUntil}. Contate ${client?.name || 'o tutor'} para agendar a imunização antecipada.`,
              timestamp: `Vence em ${v.validUntil}`,
              date: v.validUntil,
              read: readNotificationIds.includes(id),
              severity: 'alerta',
              targetScreen: 'pets',
              targetId: pet.id,
              actionLabel: 'Ver Ficha do Pet',
              meta: {
                petName: pet.name,
                clientName: client?.name,
                vaccineName: v.name,
              },
            });
          }
        }
      });
    });

    // 3. Pagamentos Atrasados (Invoices vencidas com saldo pendente)
    invoices.forEach((inv) => {
      const isOverdue =
        inv.status === 'Vencido' ||
        (inv.status !== 'Pago' && inv.dueDate < currentDate && inv.balanceDue > 0);

      if (isOverdue) {
        const id = `notif-pay-${inv.id}`;
        if (!dismissedNotificationIds.includes(id)) {
          const client = clients.find((c) => c.id === inv.clientId);
          const pet = pets.find((p) => p.id === inv.petId);

          list.push({
            id,
            type: 'pagamento',
            title: `Pagamento em Atraso: ${client?.name || 'Cliente'}`,
            message: `Fatura ${inv.receiptNumber} (${inv.serviceTitle} - ${pet?.name || 'Pet'}) de R$ ${inv.balanceDue.toFixed(2)} venceu em ${inv.dueDate}.`,
            timestamp: `Venceu em ${inv.dueDate}`,
            date: inv.dueDate,
            read: readNotificationIds.includes(id),
            severity: 'urgente',
            targetScreen: 'financeiro',
            targetId: inv.id,
            actionLabel: `Pagar R$ ${inv.balanceDue.toFixed(2)}`,
            meta: {
              clientName: client?.name,
              petName: pet?.name,
              amount: inv.balanceDue,
            },
          });
        }
      }
    });

    return list;
  }, [appointments, pets, clients, services, invoices, readNotificationIds, dismissedNotificationIds]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAllNotificationsAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds((prev) => Array.from(new Set([...prev, ...allIds])));
    showToast('Todas as notificações foram marcadas como lidas.', 'info');
  };

  const dismissNotification = (id: string) => {
    setDismissedNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const clearAllNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    setDismissedNotificationIds((prev) => Array.from(new Set([...prev, ...allIds])));
    showToast('Notificações arquivadas com sucesso.', 'info');
  };

  const handleNotificationAction = (notification: AppNotification) => {
    markNotificationAsRead(notification.id);
    setIsNotificationCenterOpen(false);

    if (notification.type === 'agendamento' && notification.targetId) {
      setCurrentScreen('agenda');
      setSelectedAppointmentId(notification.targetId);
    } else if (notification.type === 'vacina' && notification.targetId) {
      setCurrentScreen('pets');
      setSelectedPetId(notification.targetId);
    } else if (notification.type === 'pagamento' && notification.targetId) {
      setCurrentScreen('financeiro');
      const invoice = invoices.find((i) => i.id === notification.targetId);
      if (invoice) {
        openRegisterPayment(invoice);
      }
    } else if (notification.targetScreen) {
      setCurrentScreen(notification.targetScreen);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedClientId,
        setSelectedClientId,
        selectedPetId,
        setSelectedPetId,
        selectedAppointmentId,
        setSelectedAppointmentId,
        clients,
        pets,
        services,
        staff,
        appointments,
        hotelBookings,
        invoices,
        getClientById,
        getPetById,
        getServiceById,
        getPetsByClientId,
        getAppointmentsByPetId,
        getAppointmentsByClientId,
        getInvoicesByClientId,
        getInvoicesByPetId,
        getHotelBookingsByPetId,
        isNewAppointmentOpen,
        openNewAppointment,
        closeNewAppointment,
        prefilledAppointmentClient,
        prefilledAppointmentPet,
        isNewClientOpen,
        openNewClient,
        closeNewClient,
        isNewPetOpen,
        openNewPet,
        closeNewPet,
        prefilledPetClient,
        isRegisterPaymentOpen,
        paymentTargetInvoice,
        openRegisterPayment,
        closeRegisterPayment,
        isNewHotelBookingOpen,
        openNewHotelBooking,
        closeNewHotelBooking,
        isNewServiceOpen,
        openNewService,
        closeNewService,
        isTeamModalOpen,
        editingStaffMember,
        openTeamModal,
        closeTeamModal,
        addClient,
        updateClient,
        addPet,
        updatePet,
        addAppointment,
        updateAppointmentStatus,
        updateTransportStatus,
        addHotelBooking,
        updateHotelStatus,
        addService,
        toggleServiceActive,
        addStaff,
        updateStaff,
        toggleStaffActive,
        removeStaff,
        managerProfile,
        updateManagerProfile,
        recordPayment,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        notifications,
        unreadNotificationsCount,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        clearAllNotifications,
        handleNotificationAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
