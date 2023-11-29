'use client'
import React from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import {
  BillboardColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/(routes)/billboards/components/Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'

type Props = {
  data: BillboardColumn[] | null
}

const BillboardsClient: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboards (${data?.length})`}
          description='Manage your store billboards.'
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className='mr-2 h-4 w-4' />
          Add billboard
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data || []} searchKey='label' />
      <Heading title='API' description='API calls for Billboards' />
      <ApiList entityName='billboards' entityIdName='billboardId' />
    </>
  )
}

export default BillboardsClient
