/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thenationbrief.com',
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
        `https://cms.thenationbrief.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug,modified`
      )
      if (!res.ok) { hasMore = false; break }

      const posts = await res.json()
      if (posts.length === 0) { hasMore = false; break }

      for (const post of posts) {
        result.push({
          loc: `/${post.slug}`,
          lastmod: post.modified,
          changefreq: 'weekly',
          priority: 0.8,
        })
      }

      posts.length < 100 ? hasMore = false : page++
    }

    return result
  },
}