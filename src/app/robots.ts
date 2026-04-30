import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      }
    ],
    sitemap: 'https://licyesicamgarcia.com/sitemap.xml',
  }
}
