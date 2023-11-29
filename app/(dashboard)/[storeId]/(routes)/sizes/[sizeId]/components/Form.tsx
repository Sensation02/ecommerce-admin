'use client'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Size } from '@prisma/client'
import { Separator } from '@/components/ui/separator'
import { Trash } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'

const formSchema = z.object({
  name: z.string().min(1).max(255),
  value: z.string().min(1).max(255),
})

type Props = {
  initialState: Size | null
}

type FormValues = z.infer<typeof formSchema>

export const SizeForm: React.FC<Props> = ({ initialState }) => {
  const form = useForm<FormValues>({
    defaultValues: initialState || {
      name: '',
      value: '',
    },
    resolver: zodResolver(formSchema),
  })

  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialState ? 'Edit size' : 'New size'
  const description = initialState ? 'Edit your size.' : 'Create a new size.'
  const toastMessage = initialState ? 'Size updated.' : 'Size created.'
  const action = initialState ? 'Save changes' : 'Create'

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      if (initialState) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)

      router.push(`/${params.storeId}/sizes`)
      router.refresh()
      toast.success('Size deleted.')
    } catch (error: any) {
      toast.error('Make sure you removed products using this size.')
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
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialState && (
          <Button
            disabled={loading}
            variant='destructive'
            size='icon'
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash size={16} />
          </Button>
        )}
      </div>
      <Separator orientation='horizontal' />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Size name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Size value'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={loading} className='ml-auto'>
            {action}
          </Button>
        </form>
      </Form>
      <Separator orientation='horizontal' />
    </>
  )
}
