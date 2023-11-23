import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

// POST route for creating store
export async function POST(req: Request) {
  try {
    const { userId } = auth() // getting userID from clerk
    const body = await req.json() // getting body from request
    const { name } = body // getting name from body

    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    if (!name) return new NextResponse('Name is required', { status: 400 })

    // creating store in database (check prisma/schema.prisma for more info)
    const store = await prismadb.store.create({
      data: {
        // we need name of store and userId of owner
        name,
        userId,
      },
    })

    // returning store
    return NextResponse.json(store)
  } catch (error: any) {
    console.error('[STORES_POST]', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}
