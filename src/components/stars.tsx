export default function Stars({ className, raise = 14 }: { className?: string; raise?: number }) {
  const containerStyle = { transform: `translateY(${-Math.abs(raise)}px)` }

  return (
    <div className={`flex items-end gap-4 ${className ?? ''}`.trim()} style={containerStyle} aria-hidden>
      <i className="pi pi-star-fill star" style={{ transform: 'translateY(6px)' }} />
      <i className="pi pi-star-fill star star-middle" style={{ transform: 'translateY(-6px)' }} />
      <i className="pi pi-star-fill star" style={{ transform: 'translateY(6px)' }} />
    </div>
  )
}
