import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import type { Spectacle } from '../types';

interface Props {
	spectacle: Spectacle;
	onBuy?: (id: number) => void;
	className?: string;
}

export default function SpectacleCard({ spectacle, onBuy, className }: Props) {
	const formattedDate = (() => {
		try {
			const d = new Date(spectacle.date);
			return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
		} catch {
			return spectacle.date;
		}
	})();

	const header = (
		<img
			src={spectacle.imageUrl}
			alt={spectacle.title}
			style={{ width: '100%', height: 200, objectFit: 'cover' }}
		/>
	);

	const footer = (
		<div>
			<div>
				<div style={{ fontWeight: 600 }}>Prix</div>
				<div>{spectacle.price.toFixed(2)} €</div>
			</div>
			<div style={{ textAlign: 'right' }}>
				<div style={{ marginBottom: 6 }}>{spectacle.availableTickets} place(s) disponibles</div>
				<Button
					label={spectacle.availableTickets > 0 ? 'Réserver' : 'Complet'}
					icon="pi pi-shopping-cart"
					onClick={() => onBuy?.(spectacle.id)}
					disabled={spectacle.availableTickets <= 0}
				/>
			</div>
		</div>
	);

	return (
		<Card
			title={spectacle.title}
			subTitle={formattedDate}
			header={header}
			footer={footer}
			className={className ?? 'md:w-25rem'}
		>
			<p className="m-0">{spectacle.description}</p>
		</Card>
	);
}
