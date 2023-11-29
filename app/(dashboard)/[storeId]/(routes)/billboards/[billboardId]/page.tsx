import prismadb from '@/lib/prismadb'
import React from 'react'
import { BillboardForm } from '../components/Form'

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string }
}) => {
  // fetching billboard data from database:
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId, // technically it's 'new' in params from BillboardsClient when we click on the button to create a new billboard
    },
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm initialState={billboard} />
      </div>
    </div>
  )
}

export default BillboardPage
