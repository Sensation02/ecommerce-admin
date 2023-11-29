import React, { use, useEffect } from 'react'
import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import { CategoryColumn } from './components/Columns'
import CategoryClient from './components/Client'

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  // fetching billboards from the API
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage
