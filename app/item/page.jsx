'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ItemSelectPage () {
  const [selectedItem, setSelectedItem] = useState('item1')
  const router = useRouter()

  const handleSubmit = e => {
    e.preventDefault()
    localStorage.setItem('delivery_item', selectedItem)
    router.push('/delivery')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-8'>
      <div className='w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center'>
        <h1 className='text-2xl font-bold text-center mb-6 font-mono text-blue-700 tracking-wide'>
          Select an Item to Deliver
        </h1>
        <form
          onSubmit={handleSubmit}
          className='w-full flex flex-col items-center gap-4'
        >
          <select
            value={selectedItem}
            onChange={e => setSelectedItem(e.target.value)}
            className='w-full px-4 py-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
          >
            {Array.from({ length: 10 }, (_, i) => `item${i + 1}`).map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type='submit'
            className='w-full px-4 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition'
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
