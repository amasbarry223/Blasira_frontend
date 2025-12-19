export interface AdminTrip {
  id: number;
  driverName: string;
  departureAddress: string;
  destinationAddress: string;
  departureTime: string; // ou Date si vous préférez la convertir
  pricePerSeat: number;
  availableSeats: number;
  vehicleModel: string;
}
