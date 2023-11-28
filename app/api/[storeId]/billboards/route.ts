import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

// POST route for creating store
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    // params here is POST to api/[storeId]/billboards

    const { userId } = auth() // getting userID from clerk
    const body = await req.json() // getting body from request
    const { label, imageUrl } = body // getting name from body

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    if (!label) return new NextResponse('Label is required', { status: 400 })

    if (!imageUrl)
      return new NextResponse('Image URL is required', { status: 400 })

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
    const billboard = await prismadb.billboard.create({
      data: {
        // we need name of store and userId of owner
        label,
        imageUrl,
        storeId: params.storeId,
      },
    })

    // returning billboard
    return NextResponse.json(billboard)
  } catch (error: any) {
    console.error('[BILLBOARDS_POST]', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    // params here is GET to api/[storeId]/billboards

    if (!params.storeId)
      return new NextResponse('Store ID is required', { status: 400 })

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(billboards)
  } catch (error: any) {
    console.error('[BILLBOARDS_GET]', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}
