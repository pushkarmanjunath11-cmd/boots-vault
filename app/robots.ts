export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://bootsvault.vercel.app/sitemap.xml',
  }
}