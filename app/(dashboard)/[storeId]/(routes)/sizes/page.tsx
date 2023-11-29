import React from 'react'
import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import { SizeColumn } from './components/Columns'
import SizeClient from './components/Client'

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  // fetching billboards from the API
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  )
}

export default SizesPage
