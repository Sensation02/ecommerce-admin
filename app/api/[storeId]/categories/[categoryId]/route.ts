import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    if (!params.categoryId)
      return new NextResponse('Missing category ID', { status: 400 })

    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.log('[CATEGORY_GET]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } },
) {
  try {
    // params here is PATCH to api/[storeId]/billboards/[billboardId]

    // getting userID from clerk and check if user is authenticated
    const { userId } = auth()
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    // getting body from request and check if label and imageUrl exists
    const { name, billboardId } = await req.json()
    if (!name)
      return new NextResponse('Category name is required', { status: 400 })
    if (!billboardId)
      return new NextResponse('Billboard ID required', { status: 400 })

    // check if storeId exists
    if (!params.categoryId)
      return new NextResponse('Missing category ID', { status: 400 })

    // check if store exists and belongs to user (security reasons)
    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    const category = await prismadb.category.updateMany({
      where: { id: params.categoryId },
      data: { name, billboardId },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.log('[CATEGORY_PATCH]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } },
) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    if (!params.categoryId)
      return new NextResponse('Missing category ID', { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    const category = await prismadb.category.deleteMany({
      where: { id: params.categoryId },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.log('[CATEGORY_DELETE]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
