/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenId =
  | 'dashboard'
  | 'agenda'
  | 'clientes'
  | 'pets'
  | 'servicos'
  | 'hotel'
  | 'transporte'
  | 'financeiro'
  | 'historico'
  | 'relatorios'
  | 'configuracoes'
  | 'equipe';

export type PetSpecies = 'Cão' | 'Gato' | 'Outro';
export type PetSize = 'Pequeno' | 'Médio' | 'Grande' | 'Gigante';
export type PetSex = 'Macho' | 'Fêmea';

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  size: PetSize;
  age: string;
  weight: number; // in kg
  sex: PetSex;
  photoUrl: string;
  notes: string;
  specialCare: string;
  allergies: string;
  microchip?: string;
  vaccines: {
    name: string;
    date: string;
    validUntil: string;
    status: 'Em dia' | 'Pendente' | 'Vencida';
  }[];
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    zipCode: string;
  };
  notes?: string;
  registeredAt: string;
  active: boolean;
}

export type ServiceCategory =
  | 'Banho'
  | 'Tosa'
  | 'Banho e tosa'
  | 'Creche'
  | 'Hotelzinho'
  | 'Serviços adicionais';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

export type AppointmentStatus =
  | 'Confirmado'
  | 'Em andamento'
  | 'Concluído'
  | 'Cancelado'
  | 'Aguardando';

export type PaymentStatus = 'Pago' | 'Pendente' | 'Parcial' | 'Vencido';

export type PaymentMethod =
  | 'PIX'
  | 'Dinheiro'
  | 'Cartão de crédito'
  | 'Cartão de débito'
  | 'Transferência';

export type TransportType = 'Busca' | 'Entrega' | 'Leva e Traz Completo';
export type TransportStatus = 'Pendente' | 'Em rota' | 'Pet recolhido' | 'Entregue';

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  staffId: string;
  staffName: string;
  status: AppointmentStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  transport?: {
    enabled: boolean;
    type: TransportType;
    status: TransportStatus;
    driver: string;
    address: string;
    pickupTime?: string;
    deliveryTime?: string;
    transportFee: number;
  };
}

export type HotelStatus = 'Hospedado' | 'Check-out hoje' | 'Check-in previsto' | 'Finalizado';

export interface HotelBooking {
  id: string;
  clientId: string;
  petId: string;
  suiteName: string;
  category: 'Hotelzinho' | 'Creche';
  checkInDate: string; // YYYY-MM-DD
  checkInTime: string;
  checkOutDate: string; // YYYY-MM-DD
  checkOutTime: string;
  daysCount: number;
  dailyRate: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  status: HotelStatus;
  specialDiet?: string;
  medicationNotes?: string;
  belongingsNotes?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  petId: string;
  serviceTitle: string;
  appointmentId?: string;
  hotelBookingId?: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  amount: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  receiptNumber: string;
}

export type StaffCategory = 'Veterinário' | 'Estética' | 'Hotel/Creche' | 'Logística' | 'Atendimento' | 'Gestão';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  registration?: string; // CRMV, CFMV, CTPS, Registro Profissional
  category?: StaffCategory;
  phone: string;
  email?: string;
  avatar: string;
  active: boolean;
  specialties?: string[];
}

export interface ManagerProfile {
  name: string;
  role: string;
  badge: string;
  phone: string;
  email: string;
  avatar: string;
}

export type NotificationType = 'agendamento' | 'vacina' | 'pagamento' | 'sistema';
export type NotificationSeverity = 'urgente' | 'alerta' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  date: string;
  read: boolean;
  severity: NotificationSeverity;
  targetScreen?: ScreenId;
  targetId?: string;
  actionLabel?: string;
  meta?: {
    petName?: string;
    clientName?: string;
    amount?: number;
    vaccineName?: string;
    time?: string;
  };
}
