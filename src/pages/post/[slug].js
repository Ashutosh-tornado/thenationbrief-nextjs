import { useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { fetchPostBySlug } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { decode } from 'html-entities'

const CATEGORY_META = {
  'defence':           { label:'Defence',       color:'#2563EB' },
  'global-affairs':    { label:'Global Affairs', color:'#D97706' },
  'strategic-affairs': { label:'Strategic',      color:'#7c3aed' },
  'daily-brief':       { label:'Daily Brief',    color:'#DC2626' },
  'indian-infra-tech': { label:'Infra & Tech',   color:'#10B981' },
}

const processContent = (html) => {
  if (!html) return ''
  const FRONT = 'https://thenationbrief.com'
  const CMS   = 'https://cms.thenationbrief.com'
  const PAGES = ['about', 'contact', 'privacy-policy']

  let p = html
  p = p.replace(/href="https?:\/\/[^"]*?(#[^"]+)"/g, 'href="$1"')
  p = p.replace(new RegExp(`href="${CMS}/?"`, 'g'), 'href="/"')
  p = p.replace(new RegExp(`href="${FRONT}/?"`, 'g'), 'href="/"')
  p = p.replace(
    new RegExp(`href="(?:${CMS}|${FRONT})/([a-z0-9-]+)/?"`, 'g'),
    (m, slug) => (PAGES.includes(slug) ? `href="/${slug}"` : `href="/post/${slug}"`)
  )
  p = p.replace(/background-color\s*:\s*[^;'"]+;?/gi, '')
  p = p.replace(/background\s*:\s*(?!url|linear|radial)[^;'"]+;?/gi, '')
  return p
}

const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').trim()

export default function SinglePost({ post }) {
  const router     = useRouter()
  const { ref }    = router.query
  const { isDark } = useTheme()

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

  if (router.isFallback) return (
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

  const backPath  = ref === 'category' && primaryCat ? `/category/${primaryCat.slug}` : '/'
  const backLabel = ref === 'category' && primaryCat ? primaryCat.name.toUpperCase() : 'HOME'

  const pageTitle = `${decode(stripHtml(post.title.rendered))} — TheNationBrief`
  const pageDesc = decode(
  stripHtml(post.excerpt?.rendered)
).substring(0, 155)
  const canonical = `https://www.thenationbrief.com/post/${post.slug}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
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

          <Link href={backPath}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
            style={{ fontFamily:'JetBrains Mono, monospace', color: cm.color }}>
            ← BACK TO {backLabel}
          </Link>

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

          <h1 className="font-black leading-tight"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize:   'clamp(1.5rem, 5vw, 3rem)',
              color:       isDark ? '#F1F5F9' : '#1A1D20',
            }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

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

          {featuredImage && (
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border shadow-lg"
                style={{ borderColor:B }}>
                <img src={featuredImage} alt={stripHtml(post.title.rendered)} className="w-full h-auto" />
              </div>
            </div>
          )}

          <div
            className="pt-2 sm:pt-4 article-content"
            style={{ color: isDark ? '#d1d5db' : '#374151' }}
            dangerouslySetInnerHTML={{ __html: processContent(post.content.rendered) }}
          />

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

export async function getStaticPaths() {
  const paths = []
  try {
    let page = 1, hasMore = true
    while (hasMore) {
      const res = await fetch(
        `https://cms.thenationbrief.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug`
      )
      if (!res.ok) break
      const posts = await res.json()
      if (!Array.isArray(posts) || posts.length === 0) break
      posts.forEach(p => paths.push({ params: { slug: p.slug } }))
      posts.length < 100 ? hasMore = false : page++
    }
  } catch (e) {
    // build still succeeds; any missing page generated on first request
  }
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  try {
    const post = await fetchPostBySlug(params.slug)
    if (!post) return { notFound: true, revalidate: 60 }
    return { props: { post }, revalidate: 21600 } // ISR: refresh from WP every 6 hours
  } catch (e) {
    return { notFound: true, revalidate: 60 }
  }
}