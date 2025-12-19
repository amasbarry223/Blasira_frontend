export interface DailyActivity {
  [date: string]: number;
}

export interface MonthlyTrend {
  newUsers: number;
  newTrips: number;
  newBookings: number;
}

export interface MonthlyTrends {
  [month: string]: MonthlyTrend;
}

export interface DashboardStats {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  dailyActivity: DailyActivity;
  monthlyTrends: MonthlyTrends;
  recentActivities: string[];
}
