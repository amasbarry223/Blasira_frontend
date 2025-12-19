"use client"

import { AdminTrip } from "@/models/AdminTrip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AdminTripsTableProps {
  trips: AdminTrip[]
}

export function AdminTripsTable({ trips }: AdminTripsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Conducteur</TableHead>
          <TableHead>Départ</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Heure de départ</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Places</TableHead>
          <TableHead>Véhicule</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip) => (
          <TableRow key={trip.id}>
            <TableCell>{trip.id}</TableCell>
            <TableCell>{trip.driverName}</TableCell>
            <TableCell>{trip.departureAddress}</TableCell>
            <TableCell>{trip.destinationAddress}</TableCell>
            <TableCell>{new Date(trip.departureTime).toLocaleString()}</TableCell>
            <TableCell>{trip.pricePerSeat.toFixed(2)}</TableCell>
            <TableCell>{trip.availableSeats}</TableCell>
            <TableCell>{trip.vehicleModel}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
