import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

// POST route for creating store
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, billboardId } = body

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    if (!name) return new NextResponse('Name is required', { status: 400 })

    if (!billboardId)
      return new NextResponse('Billboard must be selected', { status: 400 })

    if (!params.storeId)
      return new NextResponse('Store ID is required', { status: 400 })

    // checking if store exists and belongs to user. Its made because of security reasons, so user can't create store with id of another user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    // creating store in database (check prisma/schema.prisma for more info)
    const category = await prismadb.category.create({
      data: {
        // we need name of store and userId of owner
        name,
        billboardId,
        storeId: params.storeId,
      },
    })

    // returning billboard
    return NextResponse.json(category)
  } catch (error: any) {
    console.error('[CATEGORIES_POST]', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId)
      return new NextResponse('Store ID is required', { status: 400 })

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error('[CATEGORIES_GET]', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}
