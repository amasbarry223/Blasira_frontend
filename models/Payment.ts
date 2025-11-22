import { PaymentMethod, PaymentStatus } from './enums';

export interface Payment {
  id: number;
  amount: number;
  createdAt: Date | null;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string | null;
  bookingId: number;
}

export interface CreatePaymentDto {
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  bookingId: number;
}

export interface UpdatePaymentDto {
  amount?: number;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  transactionId?: string;
}

