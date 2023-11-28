'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { ImagePlus, Trash } from 'lucide-react'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'

type Props = {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: React.FC<Props> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // result: any - because Cloudinary has no typescript support
  const onUpload = async (result: any) => {
    // As prop it will be passed url to get what we need:
    onChange(result.info.secure_url)
  }

  if (!isMounted) return null

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map((url) => {
          return (
            <div
              key={url}
              className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
            >
              <div className='z-10 absolute top-2 right-2'>
                <Button
                  type='button'
                  onClick={() => {
                    onRemove(url)
                  }}
                  variant='destructive'
                  size='icon'
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
              <Image fill className='object-cover' alt='Image' src={url} />
            </div>
          )
        })}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset='zjrgtjz7'>
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              type='button'
              onClick={onClick}
              disabled={disabled}
              variant='secondary'
            >
              <ImagePlus className='h-4 w-4 mr-2' />
              Upload image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

// uploadPreset: zjrgtjz7 - is a name of the preset that we get from Cloudinary. We can find it in settings of our Cloudinary account. It is a name of the preset that we created in Cloudinary. We can create as many presets as we want. We can create a preset for every type of image that we want to upload. For example, we can create a preset for profile images, for product images, for billboards, etc.

// we can get error in Image (from next/image) component. To fix it we need to add url which used to upload images to next.config.js:

export default ImageUpload
