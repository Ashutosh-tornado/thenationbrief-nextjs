import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

const CATEGORY_META = {
  'defence':           { label: 'Defence',       color: '#2563EB', bg: 'linear-gradient(135deg,#1e3a5f,#1e1b4b)' },
  'global-affairs':    { label: 'Global Affairs', color: '#D97706', bg: 'linear-gradient(135deg,#172554,#134e4a)' },
  'strategic-affairs': { label: 'Strategic',      color: '#7c3aed', bg: 'linear-gradient(135deg,#3b0764,#1e1b4b)' },
  'indian-infra-tech': { label: 'Infra & Tech',   color: '#10B981', bg: 'linear-gradient(135deg,#022c22,#0f172a)' },
}

const fmtDate = (d) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}.${String(dt.getDate()).padStart(2,'0')}`
}

const clean = (html, n = 110) => {
  if (typeof window === 'undefined') return ''
  const div = document.createElement('div')
  div.innerHTML = html || ''
  const decoded = div.textContent || div.innerText || ''
  const txt = document.createElement('textarea')
  txt.innerHTML = decoded
  return txt.value.trim().substring(0, n) + '...'
}

const PostCard = ({ post }) => {
  const { isDark } = useTheme()

  const cats       = post._embedded?.['wp:term']?.[0] || []
  const primaryCat = cats[0]
  const cm         = primaryCat
    ? (CATEGORY_META[primaryCat.slug] || { label: primaryCat.name, color: '#2563EB', bg: 'linear-gradient(135deg,#1e3a5f,#0f172a)' })
    : { label: 'General', color: '#2563EB', bg: 'linear-gradient(135deg,#1e3a5f,#0f172a)' }

  const img       = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const wordCount = post.content?.rendered?.replace(/<[^>]+>/g,'')?.split(' ')?.length || 300
  const readTime  = Math.max(2, Math.ceil(wordCount / 300))

  const C  = isDark ? '#141721' : '#ffffff'
  const B  = isDark ? '#1F2937' : '#E2E8F0'
  const TM = isDark ? '#9ca3af' : '#6b7280'
  const TX = isDark ? '#F1F5F9' : '#1A1D20'

  return (
    <Link
      href={`/post/${post.slug}?ref=category`}
      className="group flex flex-col rounded-2xl overflow-hidden border transition-all hover:shadow-lg"
      style={{ backgroundColor: C, borderColor: B }}
      onMouseEnter={e => e.currentTarget.style.borderColor = cm.color + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = B}
    >
      {/* Image */}
      <div className="h-44 relative overflow-hidden p-5 flex flex-col justify-between"
        style={{ background: cm.bg }}>
        {img && (
          <img src={img} alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(#fff 1px,transparent 1px)', backgroundSize: '12px 12px' }} />
        <span className="self-start text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded z-10"
          style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: cm.color }}>
          {cm.label}
        </span>
        <div className="z-10"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#9ca3af' }}>
          LOGREF: {cm.label.substring(0,3).toUpperCase()}_{post.id}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <span className="block"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: TM }}>
            UPDATED // {fmtDate(post.date)} // CLASSIFICATION: U
          </span>
          <h4 className="font-bold text-xl hover:text-blue-500 transition-colors"
            style={{ fontFamily: 'Playfair Display, serif', color: TX }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: TM }}>
            {clean(post.excerpt?.rendered)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: cm.color }}>
            DECRYPT ENTRY →
          </span>
          <span className="text-xs"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#6b7280' }}>
            {readTime} MIN
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PostCard