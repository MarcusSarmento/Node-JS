import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      posts: {
        create: [
          {
            title: "Hello World",
            content: "This is my first post",
            published: true,
          },
          {
            title: "Hello World 2",
            content: "This is my second post",
            published: false,
          },
        ],
      },
    },
  })
  const users = await prisma.user.findMany()
  const userWithPosts = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })

  console.dir(userWithPosts, { depth: null })  
  console.log(users)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
