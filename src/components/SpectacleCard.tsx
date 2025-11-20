import { Card } from 'primereact/card';
import type { Spectacle } from '../types';
import ButtonT from './button';

interface Props {
	spectacle: Spectacle;
	onBuy?: (id: number) => void;
	onOpen?: () => void;
	className?: string;
}

export default function SpectacleCard({ spectacle, onBuy, onOpen, className }: Props) {
	const formattedDate = (() => {
		try {
			const d = new Date(spectacle.date);
			return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
		} catch {
			return spectacle.date;
		}
	})();

	const header = (
		<div style={{ position: 'relative' }}>
			<img
				src={spectacle.imageUrl}
				alt={spectacle.title}
				style={{ width: '100%', height: 200, objectFit: 'cover' }}
			/>
			
			<div style={{ position: 'absolute', top: 8, left: 8 }}>
				<span className="inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm" style={{ background: '#F9E8CA', color: '#58010A', boxShadow: '2px 2px 0 #58010A' }}>
					{spectacle.availableTickets > 0 ? `${spectacle.availableTickets} place${spectacle.availableTickets > 1 ? 's' : ''}` : 'Complet'}
				</span>
			</div>
		</div>
	);

	const footer = (
		<div>
			<div>
				<div style={{ fontWeight: 600, color: '#F9E8CA' }}>Prix</div>
				<div style={{ color: '#fff' }}>{spectacle.price.toFixed(2)} €</div>
			</div>
			<div style={{ textAlign: 'right' }}>
				<ButtonT onClick={() => onBuy?.(spectacle.id)} className={spectacle.availableTickets <= 0 ? 'opacity-60 cursor-not-allowed' : ''}>
					<i className="pi pi-shopping-cart mr-2" />
					{spectacle.availableTickets > 0 ? 'Réserver' : 'Complet'}
				</ButtonT>
			</div>
		</div>
	);

	return (
		<div onClick={() => onOpen?.()} style={{ cursor: 'pointer' }}>
			<Card
				title={spectacle.title}
				subTitle={formattedDate}
				header={header}
				footer={footer}
				className={`${className ?? ''} p-card-custom md:w-25rem`.trim()}
			>
				<p className="m-0 text-white/90" style={{ height: 80, overflowY: 'hidden', paddingRight: 6 }}>{spectacle.description}</p>
			</Card>
		</div>
	);
}
