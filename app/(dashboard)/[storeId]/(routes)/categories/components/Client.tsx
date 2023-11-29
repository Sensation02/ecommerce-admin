'use client'
import React from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import {
  CategoryColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/(routes)/categories/components/Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'

type Props = {
  data: CategoryColumn[] | null
}

const CategoryClient: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Categories (${data?.length})`}
          description='Manage your store categories.'
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className='mr-2 h-4 w-4' />
          Add category
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data || []} searchKey='name' />
      <Heading title='API' description='API calls for Categories' />
      <ApiList entityName='categories' entityIdName='categoryId' />
    </>
  )
}

export default CategoryClient
