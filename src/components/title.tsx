import type { ReactNode } from 'react'

export default function TitleT({
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
            className={`bg-[#F9E8CA] text-[#58010A] text-2xl rounded-3xl py-1 pb-0.5 px-4 border-3 border-[#58010A] shadow-[2px_2px_0_#58010A] font-semibold ${className ?? ''}`.trim()}
            style={{'fontFamily': 'Limelight'}}
        >
            {children}
        </button>
    )
}