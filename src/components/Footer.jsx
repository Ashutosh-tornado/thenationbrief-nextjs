import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { label:'Defence',        path:'/category/defence' },
  { label:'Global Affairs', path:'/category/global-affairs' },
  { label:'Infra & Tech',   path:'/category/indian-infra-tech' },
  { label:'Strategic',      path:'/category/strategic-affairs' },
]

const LEGAL_LINKS = [
  { label:'About Us', path:'/about' },
  { label:'Contact Us', path:'/contact' },
  { label:'Privacy Policy', path:'/privacy-policy' },
]
const Footer = () => {
  const { isDark } = useTheme()

  const BG = isDark ? '#000000' : '#ffffff'
  const B  = isDark ? '#1F2937' : '#E2E8F0'
  const TM = '#6b7280'

  return (
    <footer
      className="border-t mt-12 sm:mt-20 lg:mt-24 transition-colors duration-300"
      style={{ backgroundColor: BG, borderColor: B }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

        {/* Main Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pb-8 sm:pb-12 border-b"
          style={{ borderColor: B }}>

          {/* Logo + Tagline */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ backgroundColor: isDark ? '#E2E8F0' : '#1A1D20' }}>
                <span className="font-bold text-xs"
                  style={{ fontFamily:'JetBrains Mono, monospace', color: isDark ? '#0D0E12' : '#ffffff' }}>
                  NB
                </span>
              </div>
              <span className="font-bold text-xl sm:text-2xl tracking-tight"
                style={{ fontFamily:'Playfair Display, serif', color: isDark ? '#4b5563' : '#9ca3af' }}>
                TheNation
                <span style={{ color: isDark ? '#374151' : '#d1d5db' }}>Brief.</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: TM }}>
              {"India's premier intelligence-grade news platform covering defence, geopolitics, infrastructure, and strategic affairs."}
            </p>
            <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 rounded border w-fit"
              style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'9px', color:'#10B981',
                       backgroundColor:'rgba(16,185,129,0.08)', borderColor:'rgba(16,185,129,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ backgroundColor:'#10B981' }} />
              SYS: ONLINE
            </div>
          </div>

          {/* Category Nav */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily:'JetBrains Mono, monospace', color: isDark ? '#374151' : '#d1d5db' }}>
              Intelligence Feeds
            </h4>
            {NAV_LINKS.map(link => (
              <Link key={link.path} href={link.path}
                className="text-xs uppercase tracking-widest transition-colors hover:text-blue-500 w-fit"
                style={{ fontFamily:'JetBrains Mono, monospace', color: TM }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ fontFamily:'JetBrains Mono, monospace', color: isDark ? '#374151' : '#d1d5db' }}>
              Protocols
            </h4>
           {LEGAL_LINKS.map(link => (
  <Link
    key={link.path}
    href={link.path}
    className="text-xs uppercase tracking-widest transition-colors hover:text-blue-500 w-fit"
    style={{ fontFamily:'JetBrains Mono, monospace', color: TM }}
  >
    {link.label}
  </Link>
))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left leading-relaxed"
            style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'9px', color: TM }}>
            © 2026 THE NATION BRIEF / ALL TELEMETRY CHANNELS ENCRYPTED.<br />
            <span className="hidden sm:inline">DESIGN PATTERN SECURED FOR HIGH-DENSITY USE.</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border"
            style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'9px', color:'#10B981',
                     backgroundColor:'rgba(16,185,129,0.08)', borderColor:'rgba(16,185,129,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
              style={{ backgroundColor:'#10B981' }} />
            SYSTEM STATUS: NORMAL // UPTIME: 99.9972%
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer