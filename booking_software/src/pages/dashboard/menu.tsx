import { MAX_FILE_SIZE } from "@/constants/config";
import { selectOptions } from "@/utils/helpers";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import type { MultiValue } from "react-select";

const DynamicSelect = dynamic(() => import('react-select'), {ssr: false})


interface MenuProps {}

type Input = {
  name: string,
  price: number,
  categories: MultiValue,
  file: undefined | File
}

const initialInput = {
  name: '',
  price: 0,
  categories: MultiValue <{value: string, label: string}>,
  file: undefined,
}

const Menu = ({}: MenuProps) => {

  const [input, setInput] = React.useState<Input>(initialInput)
  const [preview, setPreview] = React.useState<string | undefined>(undefined)
  const [error, setError] = useState<string>('')

  useEffect(() => {

    if(!input.file) return
    const objectUrl = URL.createObjectURL(input.file)
    setPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }

  }, [input.file])

  const handleFileSelect = ( e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.[0]) return setError('No file selected')
    if(e.target.files[0].size > MAX_FILE_SIZE) return setError('File size is too big')
    setInput((prev) => ({...prev, file: e.target.files![0]}))
  }

  

  return (
    <>
      <div className=''>
        <div className='mx-auto flex max-w-xl flex-col gap-2'>
          <input
            name='name'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='text'
            placeholder='name'
            onChange={(e) => setInput((prev) => ({ ...prev, name: e.target.value }))}
            value={input.name}
          />

          <input
            name='price'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='number'
            placeholder='price'
            onChange={(e) => setInput((prev) => ({ ...prev, price: Number(e.target.value) }))}
            value={input.price}
          />

          <DynamicSelect
            value={input.categories}
            // @ts-ignore @ts-expect-error - when using dynamic import, typescript doesn't know about the onChange prop
            onChange={(e) => setInput((prev) => ({ ...prev, categories: e }))}
            isMulti
            className='h-12'
            options={selectOptions}
          />

          <label
            htmlFor='file'
            className='relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none'>
            <span className='sr-only'>File input</span>
            <div className='flex h-full items-center justify-center'>
              {preview ? (
                <div className='relative h-3/4 w-full'>
                  <Image alt='preview' style={{ objectFit: 'contain' }} fill src={preview} />
                </div>
              ) : (
                <span>Select image</span>
              )}
            </div>
            <input
              name='file'
              id='file'
              onChange={handleFileSelect}
              accept='image/jpeg image/png image/jpg'
              type='file'
              className='sr-only'
            />
          </label>

          <button
            className='h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed'
            disabled={!input.file || !input.name}
            onClick={addMenuItem}>
            Add menu item
          </button>
        </div>
        {error && <p className='text-xs text-red-600'>{error}</p>}

        <div className='mx-auto mt-12 max-w-7xl'>
          <p className='text-lg font-medium'>Your menu items:</p>
          <div className='mt-6 mb-12 grid grid-cols-4 gap-8'>
            {menuItems?.map((menuItem) => (
              <div key={menuItem.id}>
                <p>{menuItem.name}</p>
                <div className='relative h-40 w-40'>
                  <Image priority fill alt='' src={menuItem.url} />
                </div>
                <button
                  onClick={() => handleDelete(menuItem.imageKey, menuItem.id)}
                  className='text-xs text-red-500'>
                  delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Menu