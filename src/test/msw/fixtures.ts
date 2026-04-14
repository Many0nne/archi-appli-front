export const spectaclesFutures = [
  { id: 1, title: 'Hamlet', description: 'Tragédie de Shakespeare', date: '2099-06-15T20:00:00', price: 25.00, availableTickets: 10, imageUrl: '/hamlet.jpg' },
  { id: 2, title: 'Le Roi Lion', description: 'Comédie musicale', date: '2099-07-20T19:30:00', price: 45.00, availableTickets: 0, imageUrl: '/lion.jpg' },
  { id: 3, title: 'Carmen', description: 'Opéra flamenco', date: '2099-08-10T21:00:00', price: 35.00, availableTickets: 5, imageUrl: '/carmen.jpg' },
]

export const spectaclesPassees = [
  { id: 4, title: 'Othello', description: 'Ancienne pièce', date: '2020-01-01T20:00:00', price: 20.00, availableTickets: 0, imageUrl: '/othello.jpg' },
]

export const reservationsUser = [
  { id: 10, reservationDate: '2026-03-01T10:00:00', quantity: 2, totalPrice: 50.00, spectacle: { id: 1, title: 'Hamlet', date: '2099-06-15T20:00:00', price: 25.00, imageUrl: '/hamlet.jpg' } },
  { id: 11, reservationDate: '2025-01-01T10:00:00', quantity: 1, totalPrice: 45.00, spectacle: { id: 2, title: 'Le Roi Lion', date: '2025-01-15T19:30:00', price: 45.00, imageUrl: '/lion.jpg' } },
]

export const adminStats = {
  totalRevenue: 1250.00,
  totalReservations: 42,
  salesBySpectacle: [
    { spectacleId: 1, title: 'Hamlet', ticketsSold: 30, revenue: 750.00 },
    { spectacleId: 3, title: 'Carmen', ticketsSold: 20, revenue: 700.00 },
  ],
}

export const mockUser = { id: 'user-123', username: 'jean.dupont', email: 'jean@example.com', name: 'Jean Dupont', roles: [] }
export const mockAdmin = { ...mockUser, roles: ['ADMIN'] }
