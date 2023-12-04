import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    if (!params.productId)
      return new NextResponse('Missing product ID', { status: 400 })

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = await req.json()

    if (!name)
      return new NextResponse('Product name is required', { status: 400 })

    if (!price)
      return new NextResponse('Product price is required', { status: 400 })

    if (!categoryId)
      return new NextResponse('Category ID is required', { status: 400 })

    if (!colorId)
      return new NextResponse('Color ID is required', { status: 400 })

    if (!sizeId) return new NextResponse('Size ID is required', { status: 400 })

    if (!images || !images.length)
      return new NextResponse('Images are required', { status: 400 })

    if (!params.storeId)
      return new NextResponse('Missing storeId', { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    })

    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    })

    // with the new images we need to delete the old ones and create the new ones. As response we need to return the new product with the new images

    return NextResponse.json(product)
  } catch (error: any) {
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    if (!params.productId)
      return new NextResponse('Missing product ID', { status: 400 })

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    })

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 403 })

    const product = await prismadb.product.deleteMany({
      where: { id: params.productId },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
