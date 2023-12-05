'use client'

import { ColumnDef } from '@tanstack/react-table'

export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    header: 'Products',
    accessorKey: 'products',
  },
  {
    header: 'Phone',
    accessorKey: 'phone',
  },
  {
    header: 'Address',
    accessorKey: 'address',
  },

  {
    header: 'Total Price',
    accessorKey: 'totalPrice',
  },
  {
    header: 'Paid',
    accessorKey: 'isPaid',
  },
]
