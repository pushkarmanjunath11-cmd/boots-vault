import { MetadataRoute } from 'next'
import { products } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://boots-vault.vercel.app'

  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/size-guide',
    '/shipping',
    '/returns',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  // Category pages (SEO FIXED - no query params)
  const categories = [
    'boots',
    'gloves',
    'balls',
    'jerseys-jackets',
    'essentials',
  ].map(cat => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date(),
  }))

  // Product pages
  const productPages = products.map(p => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: new Date(),
  }))

  // SEO pages (IMPORTANT FOR RANKING)
  const seoPages = [
    '/best-football-boots-india',
    '/nike-football-boots-india',
    '/adidas-football-boots-india',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }))

  return [
    ...staticPages,
    ...categories,
    ...productPages,
    ...seoPages,
  ]
}