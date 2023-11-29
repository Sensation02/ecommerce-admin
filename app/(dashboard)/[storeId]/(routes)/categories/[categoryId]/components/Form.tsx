'use client'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Category, Billboard } from '@prisma/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// schema for the form
const formSchema = z.object({
  name: z.string().min(1).max(255),
  billboardId: z.string().min(1).max(255),
})

type Props = {
  initialState: Category | null
  billboards: Billboard[]
}

type FormValues = z.infer<typeof formSchema>

export const CategoryForm: React.FC<Props> = ({ initialState, billboards }) => {
  const form = useForm<FormValues>({
    defaultValues: initialState || {
      name: '',
      billboardId: '',
    },
    resolver: zodResolver(formSchema),
  })

  const params = useParams()
  const router = useRouter()

  // states for the modal
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // come constants for the UI
  const title = initialState ? 'Edit category' : 'New category'
  const description = initialState
    ? 'Edit your category.'
    : 'Create a new category.'
  const toastMessage = initialState ? 'Category updated.' : 'Category created.'
  const action = initialState ? 'Save changes' : 'Create'

  // our main function that will be called when the form is submitted
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      if (initialState) {
        // patch here because we don't want to override the whole billboard object
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data,
        )
        // we need to pass the billboardId to the url because we are using it in the api route. So it's /api (of course)/storeId (which store we are updating)/billboards (all billboards)/billboardId (which billboard we are updating/adding)
      } else {
        // create a new billboard
        await axios.post(`/api/${params.storeId}/categories`, data)
      }

      router.refresh()
      // refreshing the router will revalidate the store and update the UI with the new data
      router.push(`/${params.storeId}/categories`)
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
        `/api/${params.storeId}/categories/${params.categoryId}`,
      )

      router.push(`/${params.storeId}/categories`) // remember - after we get to the homepage, there will be shown another store (if exists), if not - the user will be redirected to the create store page (modal will be shown)
      router.refresh()
      toast.success('Category deleted.')
    } catch (error: any) {
      toast.error('Make sure you removed products using this category.')
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Category name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a billboard' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                          disabled={loading}
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
