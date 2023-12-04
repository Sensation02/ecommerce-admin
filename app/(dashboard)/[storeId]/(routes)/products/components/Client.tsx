'use client'
import React from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import {
  ProductColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/(routes)/products/components/Columns'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'

type Props = {
  data: ProductColumn[] | null
}

const ProductsClient: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Products (${data?.length})`}
          description='Manage your store products.'
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add product
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data || []} searchKey='name' />
      <Heading title='API' description='API calls for Products' />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  )
}

export default ProductsClient
