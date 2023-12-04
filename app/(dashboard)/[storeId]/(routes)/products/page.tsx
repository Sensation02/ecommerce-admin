import React, { use, useEffect } from 'react'
import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import { ProductColumn } from './components/Columns'
import ProductClient from './components/Client'
import { formatter } from '@/lib/utils'

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    // what we need with the product?
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    size: product.size?.value,
    category: product.category?.name,
    color: product.color?.value,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    createdAt: format(product.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default BillboardsPage
