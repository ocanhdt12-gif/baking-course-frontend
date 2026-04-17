const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const posts = await prisma.post.findMany({ take: 2 })
  console.log(posts[0])
}
main().catch(console.error).finally(()=>prisma.$disconnect())
