import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { fetchPosts, fetchCategories } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import PostCard from '../../components/PostCard'

const CATEGORY_META = {
  'defence':           { color:'#2563EB', icon:'🛡️', desc:"In-depth coverage of India's defence programs, military technology, weapons systems, and strategic capabilities." },
  'global-affairs':    { color:'#D97706', icon:'🌐', desc:'Global politics, diplomacy, power dynamics, and international relations shaping our world.' },
  'strategic-affairs': { color:'#7c3aed', icon:'⚔️', desc:'Long-term dimensions of national power, military doctrine, security policy, and geopolitical strategy.' },
  'indian-infra-tech': { color:'#10B981', icon:'🏗️', desc:"Covering India's infrastructure growth, tech innovation, space, railways, and digital revolution." },
}

export default function CategoryPage() {
  const router                 = useRouter()
  const { slug: categorySlug } = router.query
  const { isDark }             = useTheme()

  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [catId,   setCatId]   = useState(null)

  const meta = CATEGORY_META[categorySlug] || { color:'#2563EB', icon:'📰', desc:'' }

  const displayName = categorySlug
    ? categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace('And','&')
    : ''

  const BG = isDark ? '#0B0C10' : '#F5F5F0'
  const C  = isDark ? '#12141F' : '#ffffff'
  const B  = isDark ? '#1E293B' : '#E5E5E5'
  const TM = isDark ? '#9ca3af' : '#6b7280'

  useEffect(() => {
    if (!categorySlug) return
    setLoading(true); setPosts([]); setPage(1); setCatId(null)
    fetchCategories()
      .then(cats => {
        const cat = cats.find(c => c.slug === categorySlug)
        if (!cat) { setLoading(false); return }
        setCatId(cat.id)
        return fetchPosts({ categories: cat.id, per_page: 9 })
      })
      .then(data => {
        if (data) { setPosts(data); setHasMore(data.length === 9) }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [categorySlug])

  const loadMore = async () => {
    if (!catId) return
    const next = page + 1
    const more = await fetchPosts({ categories: catId, per_page: 9, page: next })
    setPosts(prev => [...prev, ...more])
    setPage(next)
    setHasMore(more.length === 9)
  }

  if (!categorySlug) return null

  const pageTitle = `${displayName} — TheNationBrief`
  const pageDesc  = meta.desc || `${displayName} news and analysis on TheNationBrief.`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
      </Head>

      <div style={{ backgroundColor: BG, minHeight:'100vh' }}>

        {/* Banner */}
        <div className="border-b relative overflow-hidden" style={{ borderColor: B, backgroundColor: C }}>
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="w-full h-1" style={{ backgroundColor: meta.color }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6"
              style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'10px', color: TM }}>
              <Link href="/" className="hover:text-blue-500 transition-colors uppercase tracking-widest">
                HOME
              </Link>
              <span>/</span>
              <span className="uppercase tracking-widest font-bold" style={{ color: meta.color }}>
                {displayName}
              </span>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl">{meta.icon}</span>
              <h1 className="font-black leading-tight"
                style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 5vw, 3.5rem)', color: isDark ? '#F1F5F9' : '#1A1D20' }}>
                {displayName}
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed mb-4 sm:mb-6" style={{ color: TM }}>
              {meta.desc}
            </p>

            {/* Accent bar + count */}
            <div className="flex items-center gap-4">
              <div className="w-12 sm:w-16 h-1 rounded-full" style={{ backgroundColor: meta.color }} />
              {!loading && (
                <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'10px', color: TM }}>
                  {posts.length} RECORDS FOUND
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 sm:py-24">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: meta.color, borderTopColor:'transparent' }} />
              <p className="text-xs" style={{ fontFamily:'JetBrains Mono, monospace', color: TM }}>
                LOADING RECORDS...
              </p>
            </div>

          ) : posts.length ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {posts.map(post => <PostCard key={post.id} post={post} />)}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8 sm:mt-12">
                  <button
                    onClick={loadMore}
                    className="text-xs font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg uppercase tracking-wider border transition-all"
                    style={{ fontFamily: 'JetBrains Mono, monospace', borderColor: meta.color, color: meta.color }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = meta.color; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = meta.color }}
                  >
                    LOAD MORE RECORDS
                  </button>
                </div>
              )}
            </>

          ) : (
            <div className="text-center py-16 sm:py-24">
              <span className="text-4xl sm:text-5xl mb-4 block">📭</span>
              <p className="text-sm font-bold" style={{ fontFamily:'JetBrains Mono, monospace', color: TM }}>
                NO RECORDS IN THIS CATEGORY YET.
              </p>
              <p className="text-xs mt-1" style={{ fontFamily:'JetBrains Mono, monospace', color:'#4b5563' }}>
                CHECK BACK SOON.
              </p>
              <Link href="/"
                className="inline-flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all text-white"
                style={{ fontFamily:'JetBrains Mono, monospace', backgroundColor: meta.color }}>
                ← BACK TO HOME
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}