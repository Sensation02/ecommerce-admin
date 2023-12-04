'use client'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Color } from '@prisma/client'
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
  value: z
    .string()
    .min(4)
    .max(255)
    .regex(/^#([0-9a-f]{3}){1,2}$/i, {
      message: 'String must be a valid hex code.',
    }),
})

type Props = {
  initialState: Color | null
}

type FormValues = z.infer<typeof formSchema>

export const ColorForm: React.FC<Props> = ({ initialState }) => {
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

  const title = initialState ? 'Edit color' : 'New color'
  const description = initialState ? 'Edit your color.' : 'Create a new color.'
  const toastMessage = initialState ? 'Color updated.' : 'Color created.'
  const action = initialState ? 'Save changes' : 'Create'

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      if (initialState) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data,
        )
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/colors`)
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)

      router.push(`/${params.storeId}/colors`)
      router.refresh()
      toast.success('Color deleted.')
    } catch (error: any) {
      toast.error('Make sure you removed products using this color.')
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
                  <FormLabel>Color </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Color name'
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
                    <div className='flex items-center gap-x-4'>
                      <Input
                        disabled={loading}
                        placeholder='Color value'
                        {...field}
                      />
                      <div
                        className='border p-4 rounded-full'
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
