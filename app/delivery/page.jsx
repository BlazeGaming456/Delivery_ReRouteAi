'use client'
import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'

const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false
})

export default function DeliveryPage () {
  const inputRef = useRef(null)
  const [address, setAddress] = useState('')
  const [coords, setCoords] = useState(null)
  const [item, setItem] = useState('item1')
  const [showMap, setShowMap] = useState(false)

  // Only initialize autocomplete after Google Maps script is loaded
  const handleScriptLoad = () => {
    if (!window.google || !inputRef.current) return
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current
    )
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        setAddress(place.formatted_address || place.name)
        setCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        })
      }
    })
  }

  const handleStart = e => {
    e.preventDefault()
    if (!address || !coords || !item) {
      alert('Please enter your address and select an item.')
      return
    }
    setShowMap(true)
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`}
        strategy='afterInteractive'
        onLoad={handleScriptLoad}
      />
      <div className='min-h-screen bg-gray-100 py-8'>
        <div className='w-full max-w-4xl mx-auto px-4'>
          <div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
            <h1 className='text-2xl font-bold text-center mb-6 font-mono text-blue-700 tracking-wide'>
              Delivery Simulator
            </h1>
            <form
              onSubmit={handleStart}
              className='w-full flex flex-col items-center gap-4 mb-6'
            >
              <input
                ref={inputRef}
                type='text'
                placeholder='Enter your address...'
                className='w-full px-4 py-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
              />
              <select
                value={item}
                onChange={e => setItem(e.target.value)}
                className='w-full px-4 py-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
              >
                {Array.from({ length: 10 }, (_, i) => `item${i + 1}`).map(
                  item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
              <button
                type='submit'
                className='w-full px-4 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition'
              >
                Start Delivery
              </button>
            </form>
            {showMap && (
              <div className='w-full mb-4'>
                <div className='text-gray-700 font-semibold mb-2'>
                  Delivering: <span className='text-blue-700'>{item}</span>
                </div>
                <div className='text-gray-700 mb-2'>
                  To: <span className='text-blue-700'>{address}</span>
                </div>
              </div>
            )}
          </div>
          {showMap && (
            <div className='bg-white rounded-2xl shadow-xl p-6'>
              <MapComponent
                userAddress={address}
                userCoords={coords}
                selectedItem={item}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
