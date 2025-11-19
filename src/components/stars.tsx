export default function Stars({ className, raise = 14 }: { className?: string; raise?: number }) {
  // `raise` remonte l'ensemble des étoiles en pixels (valeur positive remonte)
  const containerStyle = { transform: `translateY(${-Math.abs(raise)}px)` }

  return (
    <div className={`flex items-end gap-4 ${className ?? ''}`.trim()} style={containerStyle} aria-hidden>
      {/* left star */}
      <i className="pi pi-star-fill star" style={{ transform: 'translateY(6px)' }} />

      {/* middle star elevated */}
      <i className="pi pi-star-fill star star-middle" style={{ transform: 'translateY(-6px)' }} />

      {/* right star */}
      <i className="pi pi-star-fill star" style={{ transform: 'translateY(6px)' }} />
    </div>
  )
}
