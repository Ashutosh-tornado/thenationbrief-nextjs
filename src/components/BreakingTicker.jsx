import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchPosts } from '../utils/api'

const CATEGORY_COLORS = {
  'defence':           { label: 'DEFENCE',     color: '#2563EB' },
  'global-affairs':    { label: 'GLOBAL',       color: '#D97706' },
  'strategic-affairs': { label: 'STRATEGIC',    color: '#7c3aed' },
  'indian-infra-tech': { label: 'INFRA & TECH', color: '#10B981' },
}

const decodeHTML = (html) => {
  if (typeof window === 'undefined') return html
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

const TickerItems = ({ items }) => (
  <>
    {items.map((item, i) => (
      <span key={i} className="inline-flex items-center gap-2">
        <span
          className="font-bold px-1.5 py-0.5 rounded text-white shrink-0"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            backgroundColor: item.color,
          }}
        >
          {item.label}
        </span>

        <Link
          href={`/post/${item.slug}`}
          className="hover:text-white transition-colors duration-200 whitespace-nowrap"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: '#9ca3af',
            fontWeight: '400',
          }}
        >
          {item.title}
        </Link>

        <span style={{ color: '#374151', margin: '0 12px', fontSize: '10px' }}>▶</span>
      </span>
    ))}
  </>
)

const BreakingTicker = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts({ per_page: 8 }).then(setPosts).catch(() => {})
  }, [])

  const LoadingTicker = () => (
    <div
      className="w-full overflow-hidden border-b"
      style={{ backgroundColor: '#000000', borderBottomColor: '#1E293B', borderBottomWidth: '1px' }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center py-2.5">
        <span
          className="font-bold uppercase tracking-widest mr-6 shrink-0 flex items-center gap-1.5 whitespace-nowrap border-r pr-6"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#DC2626', borderColor: '#1E293B' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
          LIVE DISPATCH
        </span>
        <span
          className="animate-pulse"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#374151' }}
        >
          LOADING INTELLIGENCE FEED...
        </span>
      </div>
    </div>
  )

  if (!posts.length) return <LoadingTicker />

  const items = posts.map(p => {
    const cat = p._embedded?.['wp:term']?.[0]?.[0]
    const cm  = cat ? (CATEGORY_COLORS[cat.slug] || { label: 'NEWS', color: '#9ca3af' })
                    : { label: 'NEWS', color: '#9ca3af' }
    return {
      slug:  p.slug,
      title: decodeHTML(p.title.rendered.replace(/<[^>]+>/g, '')),
      label: cm.label,
      color: cm.color,
    }
  })

  return (
    <div
      className="w-full overflow-hidden border-b"
      style={{ backgroundColor: '#000000', borderBottomColor: '#1E293B', borderBottomWidth: '1px' }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center py-2.5">
        <span
          className="font-bold uppercase tracking-widest mr-6 shrink-0 flex items-center gap-1.5 whitespace-nowrap border-r pr-6"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#DC2626', borderColor: '#1E293B' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
          LIVE DISPATCH
        </span>

        <div className="overflow-hidden flex-1" style={{ height: '22px', position: 'relative' }}>
          <div
            className="absolute whitespace-nowrap animate-marquee flex items-center gap-0"
            style={{ top: '50%', transform: 'translateY(-50%)', left: '0' }}
          >
            <TickerItems items={items} />
            <TickerItems items={items} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreakingTicker