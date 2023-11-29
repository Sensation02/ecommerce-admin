import React, { use, useEffect } from 'react'
import prismadb from '@/lib/prismadb'
import { format } from 'date-fns'
import { BillboardColumn } from './components/Columns'
import BillboardsClient from './components/Client'

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  // fetching billboards from the API
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
    }),
  )

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage
