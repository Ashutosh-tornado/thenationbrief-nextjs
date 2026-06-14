import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { label: 'DEFENCE',        path: '/category/defence' },
  { label: 'GLOBAL AFFAIRS', path: '/category/global-affairs' },
  { label: 'INFRA & TECH',   path: '/category/indian-infra-tech' },
  { label: 'STRATEGIC',      path: '/category/strategic-affairs' },
  { label: 'ABOUT',          path: '/about' },
  { label: 'CONTACT',        path: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'PRIVACY POLICY', path: '/privacy-policy' },
]

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [router.pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const BG   = isDark ? 'rgba(11,12,16,0.97)' : 'rgba(255,255,255,0.97)'
  const BORD = isDark ? '#1E293B' : '#E5E5E5'

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b transition-all duration-300"
        style={{
          background:           BG,
          backdropFilter:       'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor:          BORD,
          boxShadow:            scrolled ? '0 4px 32px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg shadow-md flex-shrink-0"
                style={{ backgroundColor: isDark ? '#F1F5F9' : '#1A1D20' }}
              >
                <span className="font-bold text-xs sm:text-sm"
                  style={{ fontFamily:'JetBrains Mono, monospace',
                           color: isDark ? '#0B0C10' : '#ffffff' }}>
                  NB
                </span>
              </div>
              <span className="font-bold text-lg sm:text-2xl tracking-tight"
                style={{ fontFamily:'Playfair Display, serif' }}>
                <span style={{ color: isDark ? '#F1F5F9' : '#1A1D20' }}>TheNation</span>
                <span style={{ color: '#2563EB' }}>Brief.</span>
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden xl:flex items-center space-x-4 lg:space-x-8">
              {NAV_LINKS.map(link => {
                const isActive = router.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="text-xs font-bold tracking-widest uppercase px-2 py-1 transition-all relative group"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: isActive ? '#2563EB' : isDark ? '#9ca3af' : '#6b7280',
                    }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all duration-300"
                      style={{ width: isActive ? '100%' : '0%' }}
                    />
                  </Link>
                )
              })}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* SYS STATUS pill */}
              <div
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{
                  fontFamily:      'JetBrains Mono, monospace',
                  fontSize:        '10px',
                  fontWeight:      '700',
                  color:           '#059669',
                  backgroundColor: isDark ? 'rgba(6,78,59,0.3)' : '#ECFDF5',
                  borderColor:     isDark ? 'rgba(6,95,70,0.5)' : '#A7F3D0',
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse inline-block"
                  style={{ backgroundColor: '#10B981' }} />
                SYS STATUS: ONLINE
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: isDark ? '#1F2937' : '#EAEAEF',
                  color:           isDark ? '#d1d5db' : '#374151',
                }}
              >
                <span className="text-sm sm:text-base leading-none">
                  {isDark ? '☀️' : '🌙'}
                </span>
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="xl:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-all"
                style={{ backgroundColor: isDark ? '#1F2937' : '#EAEAEF' }}
                aria-label="Toggle menu"
              >
                <span
                  className="block h-0.5 w-5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isDark ? '#F1F5F9' : '#1A1D20',
                    transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="block h-0.5 w-5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isDark ? '#F1F5F9' : '#1A1D20',
                    opacity: menuOpen ? 0 : 1,
                    transform: menuOpen ? 'scaleX(0)' : 'none',
                  }}
                />
                <span
                  className="block h-0.5 w-5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isDark ? '#F1F5F9' : '#1A1D20',
                    transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 xl:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Mobile Menu Panel ── */}
      <div
        className="fixed top-16 left-0 right-0 z-40 xl:hidden transition-all duration-300"
        style={{
          transform:     menuOpen ? 'translateY(0)' : 'translateY(-110%)',
          opacity:       menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          backgroundColor: isDark ? '#0B0C10' : '#ffffff',
          borderBottom: `1px solid ${BORD}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div className="px-4 py-6 space-y-1">

          {/* Nav Links */}
          {NAV_LINKS.map(link => {
            const isActive = router.pathname === link.path
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'space-between',
                  padding:         '14px 16px',
                  borderRadius:    '12px',
                  fontFamily:      'JetBrains Mono, monospace',
                  fontSize:        '11px',
                  fontWeight:      '700',
                  letterSpacing:   '0.1em',
                  textTransform:   'uppercase',
                  color: isActive ? '#2563EB' : isDark ? '#9ca3af' : '#6b7280',
                  backgroundColor: isActive
                    ? isDark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.06)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                  marginBottom:    '2px',
                  transition:      'all 0.2s',
                }}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span style={{ color:'#2563EB', fontSize:'10px' }}>●</span>
                )}
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-4" style={{ borderTop:`1px solid ${BORD}` }} />

          {/* Legal Links */}
{LEGAL_LINKS.map(link => (
  <Link
    key={link.path}
    href={link.path}
    onClick={() => setMenuOpen(false)}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderRadius: '12px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: isDark ? '#9ca3af' : '#6b7280',
      marginBottom: '2px',
      transition: 'all 0.2s',
    }}
  >
    <span>{link.label}</span>
  </Link>
))}

<div className="my-4" style={{ borderTop:`1px solid ${BORD}` }} />




          {/* Bottom row */}
          <div className="flex items-center justify-between px-3">
            {/* SYS STATUS */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                fontFamily:      'JetBrains Mono, monospace',
                fontSize:        '9px',
                fontWeight:      '700',
                color:           '#059669',
                backgroundColor: isDark ? 'rgba(6,78,59,0.3)' : '#ECFDF5',
                borderColor:     isDark ? 'rgba(6,95,70,0.5)' : '#A7F3D0',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ backgroundColor:'#10B981' }} />
              SYS STATUS: ONLINE
            </div>

            {/* Theme toggle in menu */}
            <button
              onClick={() => { toggleTheme(); setMenuOpen(false) }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                fontFamily:      'JetBrains Mono, monospace',
                backgroundColor: isDark ? '#1F2937' : '#EAEAEF',
                color:           isDark ? '#d1d5db' : '#374151',
              }}
            >
              <span>{isDark ? '☀️' : '🌙'}</span>
              <span style={{ fontSize:'9px' }}>{isDark ? 'LIGHT' : 'DARK'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar