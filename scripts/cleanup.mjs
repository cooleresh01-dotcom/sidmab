import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const keys = ['progressColor','social_twitter','social_instagram','social_facebook','social_linkedin','stat_events','stat_years','stat_clients','stat_satisfaction','site_name','site_tagline','site_logo','site_favicon','site_primary_color','site_secondary_color','site_email','site_phone','site_address']
try {
  for (const k of keys) {
    try {
      await prisma.setting.delete({ where: { key: k } })
      console.log('deleted:', k)
    } catch {
      console.log('not found:', k)
    }
  }
} catch (e) {
  console.error(e)
}
await prisma.$disconnect()
