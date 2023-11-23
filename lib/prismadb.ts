import { PrismaClient } from '@prisma/client'

// this is a declaration of prisma as a global variable
declare global {
  var prisma: PrismaClient | undefined
}

// declaring this will prevent multiple instances of Prisma Client in development
const prismadb = globalThis.prisma || new PrismaClient()

// if we are in development, prisma will be available as a global variable
if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prismadb
}

export default prismadb
