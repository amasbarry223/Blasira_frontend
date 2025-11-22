import { BookingStatus } from './enums';

export interface Booking {
  id: number;
  bookedSeats: number;
  createdAt: Date | null;
  discountAmount: number | null;
  status: BookingStatus;
  totalPrice: number;
  passengerId: number;
  promoCodeId: number | null;
  tripId: number;
}

export interface CreateBookingDto {
  bookedSeats: number;
  discountAmount?: number;
  status: BookingStatus;
  totalPrice: number;
  passengerId: number;
  promoCodeId?: number;
  tripId: number;
}

export interface UpdateBookingDto {
  bookedSeats?: number;
  discountAmount?: number;
  status?: BookingStatus;
  totalPrice?: number;
  promoCodeId?: number;
}

