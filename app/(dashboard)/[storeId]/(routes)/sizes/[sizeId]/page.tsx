import prismadb from '@/lib/prismadb'
import React from 'react'
import { SizeForm } from './components/Form'

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  // fetching billboard data from database:
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm initialState={size} />
      </div>
    </div>
  )
}

export default SizePage
