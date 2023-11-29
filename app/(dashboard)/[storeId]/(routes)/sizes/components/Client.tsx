'use client'
import React from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import {
  SizeColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/(routes)/sizes/components/Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'

type Props = {
  data: SizeColumn[] | null
}

const SizeClient: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Sizes (${data?.length})`}
          description='Manage sizes for your store.'
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add size
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data || []} searchKey='name' />
      <Heading title='API' description='API calls for Sizes' />
      <ApiList entityName='sizes' entityIdName='sizeId' />
    </>
  )
}

export default SizeClient
