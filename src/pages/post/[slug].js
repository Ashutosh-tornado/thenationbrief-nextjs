import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { fetchPostBySlug } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'

const CATEGORY_META = {
  'defence':           { label:'Defence',       color:'#2563EB' },
  'global-affairs':    { label:'Global Affairs', color:'#D97706' },
  'strategic-affairs': { label:'Strategic',      color:'#7c3aed' },
  'daily-brief':       { label:'Daily Brief',    color:'#DC2626' },
  'indian-infra-tech': { label:'Infra & Tech',   color:'#10B981' },
}

const processContent = (html) => {
  if (!html) return ''
  const siteUrl = 'https://ghostwhite-finch-655895.hostingersite.com'
  let p = html.replace(new RegExp(`href="${siteUrl}[^"]*?(#[^"]+)"`, 'g'), 'href="$1"')
  p = p.replace(/href="https?:\/\/[^"]*?(#[^"]+)"/g, 'href="$1"')
  p = p.replace(/background-color\s*:\s*[^;'"]+;?/gi, '')
  p = p.replace(/background\s*:\s*(?!url|linear|radial)[^;'"]+;?/gi, '')
  return p
}

const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').trim()

export default function SinglePost() {
  const router             = useRouter()
  const { slug, ref }      = router.query
  const { isDark }         = useTheme()
  const [post,    setPost]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setPost(null)
    fetchPostBySlug(slug)
      .then(d => { setPost(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!post) return
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (href?.startsWith('#')) {
        e.preventDefault()
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior:'smooth', block:'start' })
      }
    }
    const anchors = document.querySelectorAll('a[href^="#"]')
    anchors.forEach(a => a.addEventListener('click', handleAnchorClick))
    return () => anchors.forEach(a => a.removeEventListener('click', handleAnchorClick))
  }, [post])

  const BG = isDark ? '#0B0C10' : '#F5F5F0'
  const B  = isDark ? '#1E293B' : '#E5E5E5'
  const TM = isDark ? '#9ca3af' : '#6b7280'

  if (loading || !slug) return (
    <div className="flex flex-col items-center justify-center gap-3"
      style={{ minHeight:'60vh', backgroundColor:BG }}>
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-xs" style={{ fontFamily:'JetBrains Mono, monospace', color:'#6b7280' }}>
        DECRYPTING FILE...
      </p>
    </div>
  )

  if (!post) return (
    <div className="flex justify-center items-center"
      style={{ minHeight:'60vh', backgroundColor:BG }}>
      <p className="text-sm" style={{ fontFamily:'JetBrains Mono, monospace', color:'#6b7280' }}>
        FILE NOT FOUND.
      </p>
    </div>
  )

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const categories    = post._embedded?.['wp:term']?.[0] || []
  const primaryCat    = categories[0]
  const cm            = primaryCat
    ? (CATEGORY_META[primaryCat.slug] || { label:primaryCat.name, color:'#2563EB' })
    : { label:'General', color:'#2563EB' }

  const date      = new Date(post.date).toLocaleDateString('en-IN',
    { day:'numeric', month:'long', year:'numeric' })
  const wordCount = post.content?.rendered?.replace(/<[^>]+>/g,'')?.split(' ')?.length || 300
  const readTime  = Math.max(2, Math.ceil(wordCount / 300))

  const backPath  = ref === 'category' && primaryCat
    ? `/category/${primaryCat.slug}`
    : '/'
  const backLabel = ref === 'category' && primaryCat
    ? primaryCat.name.toUpperCase()
    : 'HOME'

  // SEO
  const pageTitle = `${stripHtml(post.title.rendered)} — TheNationBrief`
  const pageDesc  = stripHtml(post.excerpt?.rendered).substring(0, 155)

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="article" />
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        <meta name="twitter:card" content={featuredImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        {featuredImage && <meta name="twitter:image" content={featuredImage} />}
      </Head>

      <article style={{ backgroundColor:BG, minHeight:'100vh' }}>

        <style>{`
          .ez-toc-container, .ez-toc-widget-container,
          .wp-block-table-of-contents, [class*="toc"] {
            display: none !important;
          }
        `}</style>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 relative z-10 pb-16 sm:pb-24 space-y-4 sm:space-y-6">

          {/* Back button */}
          <Link href={backPath}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
            style={{ fontFamily:'JetBrains Mono, monospace', color: cm.color }}>
            ← BACK TO {backLabel}
          </Link>

          {/* Badge + date + read time */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {primaryCat && (
              <Link href={`/category/${primaryCat.slug}`}
                className="text-white font-black px-2.5 sm:px-3 py-1 rounded uppercase tracking-widest"
                style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'10px',
                         backgroundColor: cm.color }}>
                {cm.label}
              </Link>
            )}
            <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'10px', color:TM }}>
              {date}
            </span>
            <span style={{ color:B, fontSize:'10px' }}>•</span>
            <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'10px', color:TM }}>
              {readTime} MIN READ
            </span>
          </div>

          {/* Title */}
          <h1 className="font-black leading-tight"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize:   'clamp(1.5rem, 5vw, 3rem)',
              color:       isDark ? '#F1F5F9' : '#1A1D20',
            }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

          {/* Author */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0"
              style={{ backgroundColor: cm.color, fontFamily:'JetBrains Mono, monospace' }}>
              TNB
            </div>
            <div>
              <p className="text-xs font-bold"
                style={{ fontFamily:'JetBrains Mono, monospace',
                         color: isDark ? '#F1F5F9' : '#1A1D20' }}>
                TNB Editorial
              </p>
              <p style={{ fontFamily:'Inter, sans-serif', fontSize:'10px', color:TM }}>
                TheNationBrief Policy Research Desk
              </p>
            </div>
          </div>

          {/* Featured image */}
          {featuredImage && (
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border shadow-lg"
                style={{ borderColor:B }}>
                <img src={featuredImage} alt={stripHtml(post.title.rendered)} className="w-full h-auto" />
              </div>
            </div>
          )}

          {/* Article content */}
          <div
            className="pt-2 sm:pt-4 article-content"
            style={{ color: isDark ? '#d1d5db' : '#374151' }}
            dangerouslySetInnerHTML={{ __html: processContent(post.content.rendered) }}
          />

          {/* Footer nav */}
          <div className="pt-6 sm:pt-8 flex items-center justify-between border-t"
            style={{ borderColor:B }}>
            <Link href={backPath}
              className="text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
              style={{ fontFamily:'JetBrains Mono, monospace', color: cm.color }}>
              ← {backLabel.charAt(0) + backLabel.slice(1).toLowerCase()}
            </Link>
            <Link href="/"
              className="text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
              style={{ fontFamily:'JetBrains Mono, monospace', color:TM }}>
              Home →
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}