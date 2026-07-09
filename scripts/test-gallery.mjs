import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const url = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString: url })
const prisma = new PrismaClient({ adapter })

async function main() {
  const service = await prisma.service.findUnique({ where: { slug: 'wedding' } })
  console.log('Current gallery:', JSON.stringify(service.gallery))

  const updated = await prisma.service.update({
    where: { slug: 'wedding' },
    data: { gallery: ['https://test1.jpg', 'https://test2.jpg'] }
  })
  console.log('Updated gallery:', JSON.stringify(updated.gallery))

  const verify = await prisma.service.findUnique({ where: { slug: 'wedding' } })
  console.log('Verified gallery:', JSON.stringify(verify.gallery))

  await prisma.service.update({
    where: { slug: 'wedding' },
    data: { gallery: service.gallery }
  })
  console.log('Restored to original:', JSON.stringify(service.gallery))
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
