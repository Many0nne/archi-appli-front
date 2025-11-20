import type { ReactNode } from 'react'

export default function ButtonT({
    children,
    className,
    onClick,
    disabled = false,
}: {
    children: ReactNode
    className?: string
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
}) {
    const base = `inline-flex items-center gap-2 bg-[#FAE647] text-[#58010A] rounded-2xl py-0.5 px-3 border-3 border-[#58010A] shadow-[2px_2px_0_#58010A] transform transition-all duration-200 ease-in-out font-semibold`;
    const hover = disabled ? '' : ' hover:scale-105';
    const disabledCls = disabled ? ' opacity-60 cursor-not-allowed pointer-events-none' : '';
    const finalClass = `${base}${hover}${disabledCls} ${className ?? ''}`.trim();

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={finalClass}
            style={{ fontFamily: 'Limelight' }}
        >
            {children}
        </button>
    )
}
