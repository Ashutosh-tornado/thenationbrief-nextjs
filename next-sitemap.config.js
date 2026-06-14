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
}