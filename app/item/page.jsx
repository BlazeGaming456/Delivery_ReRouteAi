'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ITEMS = [
  {
    id: 'item1',
    name: 'Mac & Cheese',
    price: 99,
    img: 'https://i.imgur.com/1bX5QH6.png'
  },
  {
    id: 'item2',
    name: 'Chicken Breast',
    price: 249,
    img: 'https://i.imgur.com/2nCt3Sbl.png'
  },
  {
    id: 'item3',
    name: 'Hot Pockets',
    price: 120,
    img: 'https://i.imgur.com/3QnQF2A.png'
  },
  {
    id: 'item4',
    name: 'Avocado',
    price: 60,
    img: 'https://i.imgur.com/4A7IjQb.png'
  },
  {
    id: 'item5',
    name: 'Apple Juice',
    price: 80,
    img: 'https://i.imgur.com/5Qf6QwO.png'
  },
  {
    id: 'item6',
    name: 'Paneer',
    price: 150,
    img: 'https://i.imgur.com/6Qf6QwO.png'
  },
  {
    id: 'item7',
    name: 'Bread',
    price: 40,
    img: 'https://i.imgur.com/7Qf6QwO.png'
  },
  {
    id: 'item8',
    name: 'Eggs',
    price: 70,
    img: 'https://i.imgur.com/8Qf6QwO.png'
  }
]

export default function ItemPage () {
  const [selected, setSelected] = useState(null)
  const router = useRouter()

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem(
      'delivery_item',
      JSON.stringify(ITEMS.find(i => i.id === selected))
    )
    router.push('/confirmation')
  }

  return (
    <div className='max-w-4xl mx-auto mt-10'>
      <h2 className='text-2xl font-bold text-blue-700 mb-6 text-center font-mono'>
        Select an Item
      </h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
        {ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`cursor-pointer rounded-xl shadow-lg p-4 flex flex-col items-center border-2 transition-all duration-200 ${
              selected === item.id
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-transparent bg-white'
            } hover:border-blue-400`}
          >
            <img
              src={item.img}
              alt={item.name}
              className='w-20 h-20 object-contain mb-2'
            />
            <div className='font-semibold text-blue-900 mb-1'>{item.name}</div>
            <div className='text-blue-600 font-bold'>₹{item.price}</div>
          </div>
        ))}
      </div>
      <button
        className={`w-full px-4 py-3 rounded font-semibold transition ${
          selected
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!selected}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  )
}
