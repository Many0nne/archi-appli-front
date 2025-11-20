export interface SalesBySpectacleItem {
	spectacleId: number
	title: string
	ticketsSold: number
	revenue: number
}

export interface AdminStats {
	totalRevenue: number
	totalReservations: number
	salesBySpectacle: SalesBySpectacleItem[]
}