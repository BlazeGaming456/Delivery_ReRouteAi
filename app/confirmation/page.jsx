'use client'
import { useRouter } from 'next/navigation'

export default function ConfirmationPage () {
  const router = useRouter()
  if (typeof window === 'undefined') return null
  const pincode =
    typeof window !== 'undefined'
      ? localStorage.getItem('delivery_pincode')
      : ''
  const address =
    typeof window !== 'undefined'
      ? localStorage.getItem('delivery_address')
      : ''
  const item =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('delivery_item') || '{}')
      : {}

  const handleConfirm = () => {
    router.push('/delivery')
  }

  return (
    <div className='max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8'>
      <h2 className='text-2xl font-bold text-blue-700 mb-6 text-center font-mono'>
        Confirm Your Order
      </h2>
      <div className='mb-6'>
        <div className='mb-2 text-blue-900 font-semibold'>
          Delivery Address:
        </div>
        <div className='bg-blue-50 rounded p-3 text-blue-800 font-mono mb-2'>
          {address}
        </div>
        <div className='text-blue-700 font-bold'>Pincode: {pincode}</div>
      </div>
      <div className='mb-6 flex items-center gap-6'>
        <img
          src={item.img}
          alt={item.name}
          className='w-24 h-24 object-contain rounded-xl border border-blue-200'
        />
        <div>
          <div className='font-semibold text-blue-900 text-lg mb-1'>
            {item.name}
          </div>
          <div className='text-blue-600 font-bold text-xl'>₹{item.price}</div>
        </div>
      </div>
      <button
        onClick={handleConfirm}
        className='w-full px-4 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition'
      >
        Confirm & Start Delivery
      </button>
    </div>
  )
}
