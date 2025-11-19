import type { ReactNode } from 'react'

export default function ButtonT({
    children,
    className,
    onClick,
}: {
    children: ReactNode
    className?: string
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`bg-[#FAE647] text-[#58010A] rounded-2xl py-0.5 px-3 border-3 border-[#58010A] shadow-[2px_2px_0_#58010A] font-semibold ${className ?? ''}`.trim()}
            style={{'fontFamily': 'Limelight'}}
        >
            {children}
        </button>
    )
}
