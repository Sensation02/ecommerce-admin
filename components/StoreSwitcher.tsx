'use client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Store } from '@prisma/client'
import { useStoreModalStore } from '@/hooks/use-store-modal'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
// ComponentPropsWithoutRef - this mean that we are taking all props from PopoverTrigger component except ref. The type is typeof PopoverTrigger. So PopoverTriggerProps = all props from PopoverTrigger except ref

// now interface Props extends PopoverTriggerProps (add new props to PopoverTriggerProps) - items: Store[] - array of stores
interface Props extends PopoverTriggerProps {
  items: Store[]
}

export default function StoreSwitcher({ className, items = [] }: Props) {
  const storeModal = useStoreModalStore()
  const params = useParams()
  const router = useRouter()

  // formattedItems - array of objects with label and value (we don't need to pass all store data to the component, we need only id and name)
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  // currentStore - find current store by id from params
  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId,
  )

  const [open, setOpen] = useState(false)

  // onStoreSelect - when we select store from dropdown, we need to close dropdown and redirect to the selected store
  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          role='combobox'
          aria-label='Select a store'
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className='mr-2 h-4 w-4' />
          {currentStore?.label || 'Select a store'}
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className='text-base'
                >
                  <StoreIcon className='mr-2 h-5 w-5' />
                  {store.label}
                  <Check
                    className={cn(
                      'ml-auto h-5 w-5',
                      currentStore?.value === store.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  storeModal.onOpen()
                }}
                className='text-base'
              >
                <PlusCircle className='mr-2 h-5 w-5' />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
