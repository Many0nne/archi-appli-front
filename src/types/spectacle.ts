export type Spectacle = {
  id: number;
  title: string;
  description: string;
  date: string;
  price: number;
  availableTickets: number;
  imageUrl: string;
};

export type SpectacleRequest = Omit<Spectacle, 'id'>;

