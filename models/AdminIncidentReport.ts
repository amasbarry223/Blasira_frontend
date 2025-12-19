export interface AdminIncidentReport {
    id: number;
    bookingId: number;
    reporterId: number;
    reporterFirstName: string;
    reporterLastName: string;
    driverFirstName: string;
    driverLastName: string;
    reason: string;
    description: string;
    status: "RESOLVED" | "OPEN" | "IN_PROGRESS";
    severity: "LOW" | "MEDIUM" | "HIGH";
    createdAt: string;
}
