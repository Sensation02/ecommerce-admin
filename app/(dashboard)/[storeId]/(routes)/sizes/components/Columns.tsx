'use client'

import { ColumnDef } from '@tanstack/react-table'
import Action from './Action'

export type SizeColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Size',
  },
  {
    accessorKey: 'value',
    header: 'Value',
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
