'use client'

import { ColumnDef } from '@tanstack/react-table'
import Action from './Action'

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <Action data={row.original} />,
    // row.original - means that we will get all the data from the row (id, label, createdAt)
  },
]
