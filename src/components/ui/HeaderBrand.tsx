interface HeaderBrandProps {
  taille?: 'sm' | 'md' | 'lg'
  afficherDetails?: boolean
  afficherBadgeAgree?: boolean
  masquerTexteMobile?: boolean
  onClick?: () => void
}

export function HeaderBrand({
  taille = 'md',
  afficherDetails = true,
  afficherBadgeAgree = false,
  masquerTexteMobile = false,
  onClick,
}: HeaderBrandProps) {
  const logoDimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  }[taille]

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''}`}
    >
      {/* Logo officiel Johmann Formation */}
      <img
        src="/logo_johmann.png"
        alt="Logo Johmann Formation"
        className={`${logoDimensions} object-contain shrink-0`}
      />

      <div className={masquerTexteMobile ? 'hidden sm:block' : ''}>
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-[#0F172A] text-base leading-none">
            Johmann Formation
          </span>
          {afficherBadgeAgree && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FEF9EB] text-[#B45309] border border-[#FDE68A]">
              Agréé État
            </span>
          )}
        </div>
        {afficherDetails && (
          <p className="text-[11px] text-slate-500 mt-1 tracking-normal leading-tight hidden sm:block">
            Grand-Lahou • Décision N° 2012-1425 / METFP
          </p>
        )}
      </div>
    </div>
  )
}
