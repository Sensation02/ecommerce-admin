'use client'

import { Modal } from '@/components/ui/modal'
import { useStoreModalStore } from '@/hooks/use-store-modal'

export const StoreModal = () => {
  const storeModal = useStoreModalStore()
  return (
    <Modal
      title='Create Store'
      description='Add a new store to manage your products and categories.'
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Create Store
    </Modal>
  )
}
