'use client'
import { useStoreModalStore } from '@/hooks/use-store-modal'
import { useEffect } from 'react'

const SetupPage = () => {
  const onOpen = useStoreModalStore((state) => state.onOpen)
  const isOpen = useStoreModalStore((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen]) // this is a trigger to open the modal on page load. Or we can declare StoreModal in div here and pass the props to it.

  return <div className='flex min-h-screen flex-col items-center p-24'></div>
}

export default SetupPage
