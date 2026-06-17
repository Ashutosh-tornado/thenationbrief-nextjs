/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.thenationbrief.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  additionalPaths: async (config) => {
    const result = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const res = await fetch(
        `https://cms.thenationbrief.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug,modified_gmt,modified`
      )
      if (!res.ok) { hasMore = false; break }

      const posts = await res.json()
      if (posts.length === 0) { hasMore = false; break }

      for (const post of posts) {
        const raw = post.modified_gmt || post.modified
        const lastmod = raw
          ? new Date(`${raw}Z`).toISOString()   // valid: 2026-06-18T01:12:09.000Z
          : new Date().toISOString()

        result.push({
          loc: `/post/${post.slug}`,
          lastmod,
          changefreq: 'weekly',
          priority: 0.8,
        })
      }

      posts.length < 100 ? hasMore = false : page++
    }

    return result
  },
}