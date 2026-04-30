import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // No queremos que se indexe el panel de administración
    },
    sitemap: 'https://licyesicamgarcia.com/sitemap.xml',
  }
}
