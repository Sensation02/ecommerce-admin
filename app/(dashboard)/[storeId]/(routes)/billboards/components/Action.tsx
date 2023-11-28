'use client'

import React from 'react'
import { BillboardColumn } from './BillboardColumns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { AlertModal } from '@/components/modals/alert-modal'

type Props = {
  data: BillboardColumn
}

const Action: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('Billboard ID copied to clipboard.')
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      // next we need to make a request to the API to delete the billboard and pass the billboard id from data that we get from the props (from the row.original)
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)

      toast.success('Billboard deleted.')
      router.refresh()
    } catch (error: any) {
      toast.error('Make sure you removed categories using this billboard.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className='mr-2 h-4 w-4' />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Edit className='mr-2 h-4 w-4' />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Action
