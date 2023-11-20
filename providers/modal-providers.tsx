'use client'

import { StoreModal } from '@/components/modals/store-modal'
import { useEffect, useState } from 'react'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null // This is important because the div isn't rendered on the server side and will cause an error if not present (hydration error)

  return (
    <>
      <StoreModal />
    </>
  )
}

// This modal provider will provide a modal window depending on the state of the store in out custom hook useStoreModalStore. The state will be declared in page.tsx in root folder. And this Modal will be triggered in layout.tsx in root folder - it means that this modal will be rendered on every page because of provider.
