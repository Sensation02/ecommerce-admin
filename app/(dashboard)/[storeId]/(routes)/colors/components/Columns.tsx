'use client'

import { ColumnDef } from '@tanstack/react-table'
import Action from './Action'

export type ColorColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Color',
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        <div
          className='w-6 h-6 rounded-full'
          style={{ backgroundColor: row.original.value }}
        />
        <span>{row.original.value}</span>
      </div>
    ),
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
