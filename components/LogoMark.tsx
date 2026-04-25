import Image from 'next/image'

interface LogoMarkProps {
  size?: number
}

export function LogoMark({ size = 28 }: LogoMarkProps) {
  const h = Math.round(size * 1.25)
  return <Image src="/logo.svg" alt="Financiare" width={size} height={h} className="shrink-0" />
}

interface NavLogoProps {
  iconSize?: number
  showTagline?: boolean
  textClass?: string
}

export function NavLogo({ iconSize = 28, showTagline = false, textClass = 'font-bold text-slate-900' }: NavLogoProps) {
  const h = Math.round(iconSize * 1.25)
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="Financiare" width={iconSize} height={h} className="shrink-0" />
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
