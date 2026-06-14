import { useTheme } from '../context/ThemeContext'

export default function IntelPageLayout({
syslog,
title,
description,
children
}) {
const { isDark } = useTheme()

const B = isDark ? '#1E293B' : '#E5E5E5'
const TX = isDark ? '#F1F5F9' : '#1A1D20'
const TM = isDark ? '#9ca3af' : '#6b7280'
const C = isDark ? '#12141F' : '#ffffff'

return (
<div
style={{
backgroundColor: isDark ? '#0B0C10' : '#F5F5F0',
minHeight: '100vh',
backgroundImage: isDark
? 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
backgroundSize: '40px 40px',
}}
> <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">


    {/* Header */}
    <div
      className="border-b pb-4 mb-8"
      style={{ borderColor: B }}
    >
      <h2
        className="text-xs tracking-widest uppercase"
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: '#D97706'
        }}
      >
        {syslog}
      </h2>

      <h1
        className="font-bold text-3xl sm:text-4xl mt-2"
        style={{
          fontFamily: 'Playfair Display, serif',
          color: TX
        }}
      >
        {title}
      </h1>

      <p
        className="mt-2 text-sm"
        style={{
          color: TM,
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {description}
      </p>
    </div>

    {/* Content Card */}
    <div
      className="rounded-2xl border p-6 sm:p-8 lg:p-10"
      style={{
        backgroundColor: C,
        borderColor: B,
        color: TX
      }}
    >
      {children}
    </div>

  </div>
</div>


)
}
