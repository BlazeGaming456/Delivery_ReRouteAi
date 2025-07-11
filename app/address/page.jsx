'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddressPage () {
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const router = useRouter()

  const handleContinue = e => {
    e.preventDefault()
    if (!pincode || !address) {
      alert('Please enter both pincode and address.')
      return
    }
    // Save to localStorage for now (could use context for more advanced state)
    localStorage.setItem('delivery_pincode', pincode)
    localStorage.setItem('delivery_address', address)
    router.push('/item')
  }

  return (
    <div className='max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8'>
      <h2 className='text-2xl font-bold text-blue-700 mb-6 text-center font-mono'>
        Enter Your Delivery Address
      </h2>
      <form onSubmit={handleContinue} className='flex flex-col gap-6'>
        <div>
          <label className='block text-blue-900 font-semibold mb-2'>
            Pincode
          </label>
          <input
            type='text'
            value={pincode}
            onChange={e => setPincode(e.target.value)}
            className='w-full px-4 py-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            maxLength={6}
            pattern='[0-9]{6}'
            required
          />
        </div>
        <div>
          <label className='block text-blue-900 font-semibold mb-2'>
            Address
          </label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            className='w-full px-4 py-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            rows={3}
            required
          />
        </div>
        <button
          type='submit'
          className='w-full px-4 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition'
        >
          Continue
        </button>
      </form>
    </div>
  )
}
