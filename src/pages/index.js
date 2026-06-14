import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { fetchPosts } from '../utils/api'
import { useTheme } from '../context/ThemeContext'
import BreakingTicker from '../components/BreakingTicker'

const CATEGORY_META = {
  'defence':           { label:'Defence',        color:'#2563EB', bg:'linear-gradient(135deg,#1e3a5f,#1e1b4b)' },
  'global-affairs':    { label:'Global Affairs', color:'#D97706', bg:'linear-gradient(135deg,#172554,#134e4a)' },
  'strategic-affairs': { label:'Strategic',      color:'#7c3aed', bg:'linear-gradient(135deg,#3b0764,#1e1b4b)' },
  'indian-infra-tech': { label:'Infra & Tech',   color:'#10B981', bg:'linear-gradient(135deg,#022c22,#0f172a)' },
}

const FILTER_BUTTONS = [
  { label:'All Briefs', value:'all' },
  { label:'Defence',    value:'defence' },
  { label:'Global',     value:'global-affairs' },
  { label:'Tech/Infra', value:'indian-infra-tech' },
  { label:'Strategic',  value:'strategic-affairs' },
]

const getCatMeta = (post) => {
  const cat = post._embedded?.['wp:term']?.[0]?.[0]
  return cat
    ? (CATEGORY_META[cat.slug] || { label:cat.name, color:'#2563EB', bg:'linear-gradient(135deg,#1e3a5f,#0f172a)' })
    : { label:'General', color:'#2563EB', bg:'linear-gradient(135deg,#1e3a5f,#0f172a)' }
}

const getDisplayMeta = (post, activeFilter) => {
  if (activeFilter !== 'all' && CATEGORY_META[activeFilter]) {
    return CATEGORY_META[activeFilter]
  }
  const cats = post._embedded?.['wp:term']?.[0] || []
  const priority = ['defence', 'global-affairs', 'strategic-affairs', 'indian-infra-tech']
  const selected = priority.find(slug => cats.some(c => c.slug === slug))
  return selected ? CATEGORY_META[selected] : getCatMeta(post)
}

const fmtDate = d => {
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}.${String(dt.getDate()).padStart(2,'0')}`
}

const readMin = (post) =>
  Math.max(2, Math.ceil((post.content?.rendered?.replace(/<[^>]+>/g,'')?.split(' ')?.length || 300) / 300))

const clean = (html, n = 160) => {
  if (typeof window === 'undefined') return ''
  const div = document.createElement('div')
  div.innerHTML = html || ''
  const decoded = div.textContent || div.innerText || ''
  const txt = document.createElement('textarea')
  txt.innerHTML = decoded
  return txt.value.trim().substring(0, n) + '...'
}

export default function Home() {
  const { isDark } = useTheme()

  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  const C  = isDark ? '#12141F' : '#ffffff'
  const B  = isDark ? '#1E293B' : '#E5E5E5'
  const TM = isDark ? '#9ca3af' : '#6b7280'
  const TX = isDark ? '#F1F5F9' : '#1A1D20'
  const filterActiveBg     = isDark ? '#F1F5F9' : '#1A1D20'
  const filterActiveColor  = isDark ? '#0B0C10' : '#ffffff'
  const filterActiveBorder = isDark ? '#F1F5F9' : '#1A1D20'

  const now = new Date().toLocaleString('en-US', {
    weekday:'long', year:'numeric', month:'long',
    day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false
  })

  useEffect(() => {
    fetchPosts({ per_page:20 })
      .then(d => { setPosts(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const visible = filter === 'all'
    ? posts
    : posts.filter(p => (p._embedded?.['wp:term']?.[0]||[]).some(c => c.slug === filter))

  const hero        = posts[0]
  const secondary   = posts.slice(1, 3)
  const latestPosts = posts.slice(0, 6)
  const dailyBriefs = posts
    .filter(p => (p._embedded?.['wp:term']?.[0]||[]).some(c => c.slug === 'defence'))
    .slice(0, 6)

  if (loading) return (
    <div className="flex flex-col items-center justify-center gap-3"
      style={{ minHeight:'60vh', backgroundColor: isDark ? '#0B0C10' : '#F5F5F0' }}>
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-xs" style={{ fontFamily:'JetBrains Mono, monospace', color:'#6b7280' }}>
        LOADING INTELLIGENCE BRIEFS...
      </p>
    </div>
  )

  return (
    <>
      <Head>
        <title>TheNationBrief — Defence & Geopolitics Intelligence</title>
        <meta name="description" content="India's premier defence and geopolitics intelligence portal covering military, strategic affairs and global news." />
        <meta property="og:title" content="TheNationBrief — Defence & Geopolitics Intelligence" />
        <meta property="og:description" content="India's premier defence and geopolitics intelligence portal." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="TheNationBrief — Defence & Geopolitics Intelligence" />
      </Head>

      <div style={{
        backgroundColor: isDark ? '#0B0C10' : '#F5F5F0',
        minHeight:'100vh',
        backgroundImage: isDark
          ? 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
          : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        <BreakingTicker />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 lg:space-y-20">

          {/* 01 — LATEST UPDATES */}
          <section className="space-y-4 sm:space-y-6">
            <div className="border-b pb-3 sm:pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 sm:gap-0"
              style={{ borderColor:B }}>
              <div>
                <h2 className="text-xs tracking-widest uppercase"
                  style={{ fontFamily:'JetBrains Mono, monospace', color:'#D97706' }}>
                  SYS_LOG // 01. Latest Updates
                </h2>
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mt-1"
                  style={{ fontFamily:'Playfair Display, serif', color:TX }}>
                  Latest Intelligence Reports
                </h3>
                <p className="text-xs sm:text-sm mt-1" style={{ color:TM }}>
                  Auto-updated with every new article published.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {latestPosts.map(post => {
                const cm  = getCatMeta(post)
                const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                return (
                  <Link key={post.id} href={`/post/${post.slug}?ref=home`}
                    className="group flex flex-col rounded-2xl overflow-hidden border transition-all hover:shadow-lg"
                    style={{ backgroundColor:C, borderColor:B }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = cm.color+'60'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = B}
                  >
                    <div className="relative overflow-hidden flex flex-col justify-between p-4"
                      style={{ height:'clamp(130px,22vw,160px)', background: cm.bg }}>
                      {img && (
                        <img src={img} alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage:'radial-gradient(#fff 1px,transparent 1px)', backgroundSize:'12px 12px' }} />
                      <span className="self-start text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded z-10"
                        style={{ fontFamily:'JetBrains Mono, monospace', backgroundColor: cm.color }}>
                        {cm.label}
                      </span>
                      <div className="z-10"
                        style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'9px', color:'#9ca3af' }}>
                        {fmtDate(post.date)}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-base leading-snug line-clamp-2 hover:text-blue-500 transition-colors"
                          style={{ fontFamily:'Playfair Display, serif', color:TX }}
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color:TM }}>
                          {clean(post.excerpt?.rendered, 100)}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ fontFamily:'JetBrains Mono, monospace', color: cm.color }}>
                        READ MORE →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* 02 — DAILY DEFENCE BRIEF */}
          <section className="space-y-4 sm:space-y-6">
            <div className="border-b pb-3 sm:pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 sm:gap-0"
              style={{ borderColor:B }}>
              <div>
                <h2 className="text-xs tracking-widest uppercase"
                  style={{ fontFamily:'JetBrains Mono, monospace', color:'#D97706' }}>
                  SYS_LOG // 02. Daily Defence Brief
                </h2>
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mt-1"
                  style={{ fontFamily:'Playfair Display, serif', color:TX }}>
                  {"Today's Defence Briefing"}
                </h3>
                <p className="text-xs sm:text-sm mt-1" style={{ color:TM }}>
                  Latest defence updates — auto updated with every new article.
                </p>
              </div>
              <span className="text-xs hidden sm:inline"
                style={{ fontFamily:'JetBrains Mono, monospace', color:'#2563EB' }}>
                ● LIVE
              </span>
            </div>

            {dailyBriefs.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {dailyBriefs.map(post => {
                  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                  return (
                    <Link key={post.id} href={`/post/${post.slug}?ref=home`}
                      className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden border transition-all hover:shadow-lg"
                      style={{ backgroundColor:C, borderColor:B }}
                      onMouseEnter={e => e.currentTarget.style.borderColor='#2563EBaa'}
                      onMouseLeave={e => e.currentTarget.style.borderColor=B}
                    >
                      <div className="relative overflow-hidden sm:w-2/5 flex-shrink-0"
                        style={{ minHeight:'140px', background:'linear-gradient(135deg,#1e3a5f,#1e1b4b)' }}>
                        {img && (
                          <img src={img} alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                        <span className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded z-10"
                          style={{ fontFamily:'JetBrains Mono, monospace', backgroundColor:'#2563EB' }}>
                          DEFENCE
                        </span>
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-2">
                        <div className="space-y-2">
                          <span className="block"
                            style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'9px', color:TM }}>
                            {fmtDate(post.date)}
                          </span>
                          <h4 className="font-bold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-blue-500 transition-colors"
                            style={{ fontFamily:'Playfair Display, serif', color:TX }}
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                          <p className="text-xs leading-relaxed line-clamp-2" style={{ color:TM }}>
                            {clean(post.excerpt?.rendered, 110)}
                          </p>
                        </div>
                        <span className="text-xs font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all"
                          style={{ fontFamily:'JetBrains Mono, monospace', color:'#2563EB' }}>
                          READ BRIEF →
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border" style={{ borderColor:B, backgroundColor:C }}>
                <p className="text-sm" style={{ fontFamily:'JetBrains Mono, monospace', color:TM }}>
                  No daily briefs published yet. Check back soon.
                </p>
              </div>
            )}
          </section>

          {/* 03 — EXECUTIVE BRIEF */}
          <section className="space-y-4 sm:space-y-6">
            <div className="border-b pb-3 sm:pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 sm:gap-0"
              style={{ borderColor:B }}>
              <div>
                <h2 className="text-xs tracking-widest uppercase"
                  style={{ fontFamily:'JetBrains Mono, monospace', color:'#D97706' }}>
                  SYS_LOG // 03. The Executive Brief
                </h2>
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mt-1"
                  style={{ fontFamily:'Playfair Display, serif', color:TX }}>
                  Sovereign Threat Profiles & Security Intelligence
                </h3>
              </div>
              <span className="text-xs hidden sm:inline"
                style={{ fontFamily:'JetBrains Mono, monospace', color:TM }}>
                UPDATED: {now} IST
              </span>
            </div>

            {hero && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                <Link href={`/post/${hero.slug}?ref=home`}
                  className="lg:col-span-8 flex flex-col rounded-2xl overflow-hidden border group transition-all duration-300 hover:shadow-xl"
                  style={{ backgroundColor:C, borderColor:B }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='rgba(37,99,235,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor=B}
                >
                  <div className="relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 md:p-8"
                    style={{
                      height: 'clamp(200px, 40vw, 320px)',
                      background: hero._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 'none' : getCatMeta(hero).bg
                    }}
                  >
                    {hero._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                      <img src={hero._embedded['wp:featuredmedia'][0].source_url} alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage:'radial-gradient(#fff 1px,transparent 1px)', backgroundSize:'16px 16px' }} />
                    )}
                    <div className="absolute inset-0"
                      style={{ background:'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 100%)' }} />
                    <div className="relative flex justify-between items-start z-10">
                      <span className="text-white text-xs font-bold uppercase tracking-wider px-2 sm:px-3 py-1 rounded-md"
                        style={{ fontFamily:'JetBrains Mono, monospace', backgroundColor:'rgba(37,99,235,0.9)' }}>
                        {getCatMeta(hero).label}
                      </span>
                      <span className="text-xs hidden sm:flex items-center gap-1"
                        style={{ fontFamily:'JetBrains Mono, monospace', color:'#4ade80' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping inline-block" />
                        SIGNAL ACTIVE
                      </span>
                    </div>
                    <div className="relative z-10 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-widest hidden sm:block"
                        style={{ fontFamily:'JetBrains Mono, monospace', color:'#eab308' }}>
                        DEEP DIVE REPORT
                      </span>
                      <h4 className="font-bold text-white leading-tight group-hover:text-blue-200 transition-colors line-clamp-2"
                        style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(1.2rem, 3.5vw, 2.4rem)' }}
                        dangerouslySetInnerHTML={{ __html: hero.title.rendered }} />
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between space-y-3 sm:space-y-4"
                    style={{ backgroundColor:C }}>
                    <p className="text-sm leading-relaxed line-clamp-2 sm:line-clamp-3" style={{ color:TM }}>
                      {clean(hero.excerpt?.rendered, 200)}
                    </p>
                    <div className="pt-3 sm:pt-4 border-t flex items-center justify-between"
                      style={{ borderColor: isDark ? '#1f2937' : '#f3f4f6' }}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-blue-500"
                          style={{ backgroundColor:'rgba(37,99,235,0.1)', fontFamily:'JetBrains Mono, monospace' }}>
                          TNB
                        </div>
                        <span className="text-xs hidden sm:inline"
                          style={{ fontFamily:'JetBrains Mono, monospace', color:TM }}>
                          By TNB Editorial
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-500 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                        style={{ fontFamily:'JetBrains Mono, monospace' }}>
                        DECRYPT DOSSIER →
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-4 lg:gap-6">
                  {secondary.map((post, i) => {
                    const cm = getCatMeta(post)
                    return (
                      <Link key={post.id} href={`/post/${post.slug}?ref=home`}
                        className="p-4 sm:p-5 lg:p-6 rounded-2xl border flex flex-col justify-between group transition-all duration-300 hover:shadow-md"
                        style={{
                          backgroundColor: i===1 ? (isDark ? '#11131c' : '#1A1D20') : C,
                          borderColor: B,
                          minHeight: '160px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = i===0 ? '#D97706' : '#10B981'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = B}
                      >
                        <div className="space-y-1.5 sm:space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider block"
                            style={{ fontFamily:'JetBrains Mono, monospace', color: i===1 ? '#10B981' : '#D97706' }}>
                            {cm.label}
                          </span>
                          <h4 className="font-bold text-base sm:text-lg lg:text-xl leading-snug line-clamp-3"
                            style={{ fontFamily:'Playfair Display, serif', color: i===1 ? '#F1F5F9' : TX }}
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                          <p className="text-xs leading-relaxed line-clamp-2 hidden sm:block"
                            style={{ color: i===1 ? '#6b7280' : TM }}>
                            {clean(post.excerpt?.rendered, 100)}
                          </p>
                        </div>
                        <div className="pt-2 sm:pt-3 flex justify-between items-center"
                          style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'10px', color:'#6b7280' }}>
                          <span>{readMin(post)} MIN READ</span>
                          <span style={{ color: i===1 ? '#10B981' : '#D97706' }}>→</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </section>

          {/* 04 — INTELLIGENCE GRID */}
          <section className="space-y-6 sm:space-y-8">
            <div className="border-b pb-3 sm:pb-4 flex flex-col gap-4" style={{ borderColor:B }}>
              <div>
                <h2 className="text-xs tracking-widest uppercase"
                  style={{ fontFamily:'JetBrains Mono, monospace', color:'#D97706' }}>
                  SYS_LOG // 04. Intelligence Grid
                </h2>
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mt-1"
                  style={{ fontFamily:'Playfair Display, serif', color:TX }}>
                  Unified Searchable Database
                </h3>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth:'none', msOverflowStyle:'none' }}>
                {FILTER_BUTTONS.map(btn => (
                  <button key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className="flex-shrink-0 text-xs px-3 sm:px-4 py-2 rounded-lg uppercase tracking-wider font-bold transition-all"
                    style={{
                      fontFamily:'JetBrains Mono, monospace',
                      backgroundColor: filter===btn.value ? filterActiveBg    : C,
                      color:           filter===btn.value ? filterActiveColor  : TM,
                      border:'1px solid',
                      borderColor:     filter===btn.value ? filterActiveBorder : B,
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {visible.map(post => {
                const cm  = getDisplayMeta(post, filter)
                const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                return (
                  <Link key={post.id} href={`/post/${post.slug}?ref=home`}
                    className="group flex flex-col rounded-2xl overflow-hidden border transition-all hover:shadow-lg"
                    style={{ backgroundColor:C, borderColor:B }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = cm.color+'60'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = B}
                  >
                    <div className="relative overflow-hidden p-4 sm:p-5 flex flex-col justify-between"
                      style={{ height:'clamp(140px,25vw,176px)', background: cm.bg }}>
                      {img && (
                        <img src={img} alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage:'radial-gradient(#fff 1px,transparent 1px)', backgroundSize:'12px 12px' }} />
                      <span className="self-start text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded z-10"
                        style={{ fontFamily:'JetBrains Mono, monospace', backgroundColor: cm.color }}>
                        {cm.label}
                      </span>
                      <div className="z-10"
                        style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'9px', color:'#9ca3af' }}>
                        LOGREF: {cm.label.substring(0,3).toUpperCase()}_{post.id}
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <span className="block"
                          style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'9px', color:TM }}>
                          UPDATED // {fmtDate(post.date)} // CLASSIFICATION: U
                        </span>
                        <h4 className="font-bold text-base sm:text-xl hover:text-blue-500 transition-colors"
                          style={{ fontFamily:'Playfair Display, serif', color:TX }}
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        <p className="text-xs leading-relaxed line-clamp-2 sm:line-clamp-3" style={{ color:TM }}>
                          {clean(post.excerpt?.rendered, 120)}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase self-start flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ fontFamily:'JetBrains Mono, monospace', color: cm.color }}>
                        DECRYPT ENTRY →
                      </span>
                    </div>
                  </Link>
                )
              })}

              <div className="flex flex-col justify-center items-center text-center p-6 sm:p-8 rounded-2xl border space-y-3 sm:space-y-4"
                style={{ backgroundColor: isDark ? '#0D0D14' : '#1A1D20',
                         borderColor: isDark ? '#1E293B' : '#374151', color:'#F1F5F9',
                         minHeight: '200px' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-700 flex items-center justify-center shadow-inner"
                  style={{ backgroundColor:'rgba(17,19,28,0.6)' }}>
                  <span className="text-xl sm:text-2xl text-blue-500 animate-pulse font-mono">+</span>
                </div>
                <h4 className="font-bold text-lg sm:text-2xl" style={{ fontFamily:'Playfair Display, serif' }}>
                  Access Intelligence Repository
                </h4>
                <p className="text-xs text-gray-400 max-w-xs">
                  Unlock deep analysis files, quantitative whitepapers, and defence simulation databases.
                </p>
                <button className="text-xs font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg uppercase tracking-wider transition-all hover:bg-blue-600 hover:text-white"
                  style={{ fontFamily:'JetBrains Mono, monospace', backgroundColor:'#ffffff', color:'#0B0C10' }}>
                  QUERY DATABASE CORE
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}