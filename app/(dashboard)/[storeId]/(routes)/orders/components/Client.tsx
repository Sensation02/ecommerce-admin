'use client'
import React from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { OrderColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'

type Props = {
  data: OrderColumn[] | null
}

const OrderClient: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <Heading
        title={`Orders (${data?.length})`}
        description='Manage your store orders.'
      />
      <Separator />
      <DataTable columns={columns} data={data || []} searchKey='products' />
    </>
  )
}

export default OrderClient
