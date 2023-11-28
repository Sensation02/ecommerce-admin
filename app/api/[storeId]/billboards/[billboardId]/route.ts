import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    if (!params.billboardId)
      return new NextResponse('Missing billboard ID', { status: 400 })

    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    })

    return NextResponse.json(billboard)
  } catch (error: any) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } },
) {
  try {
    // params here is PATCH to api/[storeId]/billboards/[billboardId]

    // getting userID from clerk and check if user is authenticated
    const { userId } = auth()
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    // getting body from request and check if label and imageUrl exists
    const { label, imageUrl } = await req.json()
    if (!label)
      return new NextResponse('Billboard label required', { status: 400 })
    if (!imageUrl)
      return new NextResponse('Billboard image URL required', { status: 400 })

    // check if storeId exists
    if (!params.storeId)
      return new NextResponse('Missing storeId', { status: 400 })

    // check if store exists and belongs to user (security reasons)
    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    const billboard = await prismadb.billboard.updateMany({
      where: { id: params.billboardId },
      data: { label, imageUrl },
    })

    return NextResponse.json(billboard)
  } catch (error: any) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } },
) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    if (!params.billboardId)
      return new NextResponse('Missing billboard ID', { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    const billboard = await prismadb.billboard.deleteMany({
      where: { id: params.billboardId },
    })

    return NextResponse.json(billboard)
  } catch (error: any) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
