interface LogoMarkProps {
  size?: number
}

export function LogoMark({ size = 28 }: LogoMarkProps) {
  const h = Math.round(size * 1.25)
  return (
    <svg width={size} height={h} viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Upper wing — top bar of F */}
      <path d="M2 2 L26 2 L22 13 L2 13 Z" fill="#6B7BAA" />
      {/* Lower wing — arm of F, lighter */}
      <path d="M2 17 L20 17 L16 28 L2 28 Z" fill="#89AEBE" />
      {/* Vertical connector */}
      <rect x="2" y="2" width="6" height="26" rx="1" fill="#6B7BAA" opacity="0.25" />
    </svg>
  )
}

interface NavLogoProps {
  iconSize?: number
  showTagline?: boolean
  textClass?: string
}

export function NavLogo({ iconSize = 28, showTagline = false, textClass = 'font-bold text-slate-900' }: NavLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={iconSize} />
      <div className="flex flex-col leading-none">
        <span className={textClass}>Financiare</span>
        {showTagline && (
          <span className="text-[10px] font-light tracking-widest text-slate-400 uppercase">
            Negócios Imobiliários
          </span>
        )}
      </div>
    </div>
  )
}
