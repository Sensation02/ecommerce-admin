'use client'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Billboard } from '@prisma/client'
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
import ImageUpload from '@/components/ui/ImageUpload'

// schema for the form
const formSchema = z.object({
  label: z.string().min(1).max(255),
  imageUrl: z.string().url().max(255),
})

// types for the component (we need Billboard or null because it can be it)
type Props = {
  initialState: Billboard | null // Billboard is model from prisma
}

// type for the form values according to the schema
type FormValues = z.infer<typeof formSchema>

export const BillboardForm: React.FC<Props> = ({ initialState }) => {
  // we need to pass the initial values to the useForm hook
  const form = useForm<FormValues>({
    defaultValues: initialState || {
      label: '',
      imageUrl: '',
    },
    resolver: zodResolver(formSchema),
  })

  // we need to get the storeId from the url so we need params and router from next
  const params = useParams()
  const router = useRouter()

  // states for the modal
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // come constants for the UI
  const title = initialState ? 'Edit billboard' : 'New billboard'
  const description = initialState
    ? 'Edit your billboard.'
    : 'Create a new billboard.'
  const toastMessage = initialState
    ? 'Billboard updated.'
    : 'Billboard created.'
  const action = initialState ? 'Save changes' : 'Create'

  // our main function that will be called when the form is submitted
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      if (initialState) {
        // patch here because we don't want to override the whole billboard object
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data,
        )
        // we need to pass the billboardId to the url because we are using it in the api route. So it's /api (of course)/storeId (which store we are updating)/billboards (all billboards)/billboardId (which billboard we are updating/adding)
      } else {
        // create a new billboard
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }

      router.refresh()
      // refreshing the router will revalidate the store and update the UI with the new data
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
      )

      router.push(`/${params.storeId}/billboards`) // remember - after we get to the homepage, there will be shown another store (if exists), if not - the user will be redirected to the create store page (modal will be shown)
      router.refresh()
      toast.success('Billboard deleted.')
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
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Billboard label'
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
