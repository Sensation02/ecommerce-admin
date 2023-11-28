'use client'
import { useOrigin } from '@/hooks/use-origins'
import { useParams } from 'next/navigation'
import React from 'react'
import { ApiAlert } from './ApiAlert'

type Props = {
  entityName: string
  entityIdName: string
}

const ApiList: React.FC<Props> = ({ entityName, entityIdName }) => {
  const params = useParams()
  const origin = useOrigin()

  const baseUrl = `${origin}/api/${params.storeId}`

  return (
    <>
      <ApiAlert
        title='GET'
        variant='public'
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title='GET'
        variant='public'
        // to see the individual billboard we need to pass the billboard id
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title='POST'
        variant='admin'
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title='PATCH'
        variant='admin'
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title='DELETE'
        variant='admin'
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  )
}

export default ApiList
