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
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryProgress, setDeliveryProgress] = useState(0)
  const [currentDestination, setCurrentDestination] = useState('')

  //Only initialize autocomplete after Google Maps script is loaded
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
    setIsLoading(true)
    setTimeout(() => {
      setShowMap(true)
      setCurrentDestination(address) //Set initial destination
      setIsLoading(false)
    }, 1000)
  }

  //Item List
  const popularItems = [
    {
      id: 'item1',
      name: 'SoundCore Q20i',
      category: 'Electronics',
      price: '$299.99'
    },
    {
      id: 'item2',
      name: 'Gardening Set',
      category: 'Home',
      price: '$149.99'
    },
    {
      id: 'item3',
      name: 'Badminton Set',
      category: 'Sports',
      price: '$89.99'
    },
    {
      id: 'item4',
      name: 'Dishwasher',
      category: 'Kitchen',
      price: '$199.99'
    },
    {
      id: 'item5',
      name: 'Saree',
      category: 'Fashion',
      price: '$179.99'
    },
    {
      id: 'item6',
      name: 'One Piece Manga',
      category: 'Books',
      price: '$59.99'
    },
    { id: 'item7', name: 'Lego Marvel Set', category: 'Toys', price: '$79.99' },
    {
      id: 'item8',
      name: 'Dove Cosmetic Set',
      category: 'Health',
      price: '$129.99'
    },
    {
      id: 'item9',
      name: 'Automotive Parts',
      category: 'Auto',
      price: '$249.99'
    },
    { id: 'item10', name: 'Pet Carrier', category: 'Pets', price: '$99.99' }
  ]

  return (
    <>
      {/* Loading the Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`}
        strategy='afterInteractive'
        onLoad={handleScriptLoad}
      />

      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-[#0071ce] to-[#005a9e] text-white py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center'>
              <div className='flex justify-center mb-6'>
                <div className='bg-white rounded-full w-16 h-16 flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-[#0071ce]'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
              </div>
              <h1 className='text-4xl md:text-5xl font-bold mb-2'>
                Smart Delivery Rerouting
              </h1>
              <p className='text-lg md:text-xl text-blue-200 mb-4 italic'>
                Reroute to Efficiency
              </p>
              <p className='text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto'>
                Experience next-generation logistics with intelligent rerouting,
                powered by an intelligent pathfinding algorithm for optimal
                delivery routes and real-time adjustments.
              </p>
              <div className='flex flex-wrap justify-center gap-4 text-sm'>
                <div className='bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm'>
                  🚚 Smart Routing
                </div>
                <div className='bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm'>
                  ⚡ Real-time Updates
                </div>
                <div className='bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm'>
                  🧭 A* Pathfinding
                </div>
                <div className='bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm'>
                  📍 Live Tracking
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Section */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          {!showMap ? (
            <div className='grid lg:grid-cols-2 gap-12 items-start'>
              {/* Order Form */}
              <div className='card-walmart p-8'>
                <div className='flex items-center mb-6'>
                  <div className='bg-[#0071ce] rounded-lg w-10 h-10 flex items-center justify-center mr-3'>
                    <svg
                      className='w-5 h-5 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900'>
                      Create Your Order
                    </h2>
                    <p className='text-gray-600'>
                      Enter your details to start the delivery simulation
                    </p>
                  </div>
                </div>

                <form onSubmit={handleStart} className='space-y-6'>
                  {/* Address Input */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Delivery Address
                    </label>
                    <div className='relative'>
                      <input
                        ref={inputRef}
                        type='text'
                        placeholder='Enter your delivery address...'
                        className='input-walmart w-full pr-10'
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                      />
                      <div className='absolute top-0 right-0 bottom-0 pr-3 flex items-center pointer-events-none'>
                        <svg
                          className='h-5 w-5 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Item Selection */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Select Item
                    </label>
                    <select
                      value={item}
                      onChange={e => setItem(e.target.value)}
                      className='input-walmart w-full'
                    >
                      {popularItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {item.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Item Preview */}
                  {item && (
                    <div className='bg-gray-50 rounded-lg p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-semibold text-gray-900'>
                            {popularItems.find(i => i.id === item)?.name}
                          </h4>
                          <p className='text-sm text-gray-600'>
                            {popularItems.find(i => i.id === item)?.category} •{' '}
                            {popularItems.find(i => i.id === item)?.price}
                          </p>
                        </div>
                        <div className='bg-[#0071ce] text-white px-3 py-1 rounded-full text-sm font-medium'>
                          Selected
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Start Button */}
                  <button
                    type='submit'
                    disabled={isLoading || !address || !item}
                    className='btn-walmart w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Initializing Delivery...
                      </>
                    ) : (
                      <>
                        <svg
                          className='w-5 h-5 mr-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 10V3L4 14h7v7l9-11h-7z'
                          />
                        </svg>
                        Start Delivery Simulation
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Features & Info */}
              <div className='space-y-6'>
                {/* How It Works Section*/}
                <div className='card-walmart p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
                    <svg
                      className='w-6 h-6 text-[#0071ce] mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                      />
                    </svg>
                    How It Works
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='bg-[#0071ce] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5'>
                        1
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          Enter Address
                        </h4>
                        <p className='text-gray-600 text-sm'>
                          Provide your delivery address using Google Places
                          autocomplete
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <div className='bg-[#0071ce] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5'>
                        2
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          Select Item
                        </h4>
                        <p className='text-gray-600 text-sm'>
                          Choose from our curated selection of popular items
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <div className='bg-[#0071ce] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5'>
                        3
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          Watch the Routing
                        </h4>
                        <p className='text-gray-600 text-sm'>
                          Observe intelligent route optimization in real-time
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <div className='bg-[#0071ce] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5'>
                        4
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          Re-route the delivery
                        </h4>
                        <p className='text-gray-600 text-sm'>
                          Watch the algorithm re-route the delivery to the new
                          location
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className='card-walmart p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
                    <svg
                      className='w-6 h-6 text-[#0071ce] mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
                    Key Features
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-[#0071ce] rounded-full'></div>
                      <span className='text-sm text-gray-700'>
                        A* Pathfinding Algorithm
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-[#0071ce] rounded-full'></div>
                      <span className='text-sm text-gray-700'>
                        Real-time Rerouting
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-[#0071ce] rounded-full'></div>
                      <span className='text-sm text-gray-700'>
                        Live Progress Tracking
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-[#0071ce] rounded-full'></div>
                      <span className='text-sm text-gray-700'>
                        Cost Optimization
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-[#0071ce] rounded-full'></div>
                      <span className='text-sm text-gray-700'>
                        Warehouse Network
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-[#0071ce] rounded-full'></div>
                      <span className='text-sm text-gray-700'>
                        Interactive Map
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className='card-walmart p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4 flex items-center'>
                    <svg
                      className='w-6 h-6 text-[#0071ce] mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                    System Performance
                  </h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-[#0071ce]'>
                        14
                      </div>
                      <div className='text-sm text-gray-600'>Warehouses</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-[#0071ce]'>
                        30%
                      </div>
                      <div className='text-sm text-gray-600'>Faster Routes</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-[#0071ce]'>
                        99.9%
                      </div>
                      <div className='text-sm text-gray-600'>Uptime</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-[#0071ce]'>
                        50%
                      </div>
                      <div className='text-sm text-gray-600'>
                        Increased Customer Retention
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Delivery Simulation View */
            <div className='space-y-6'>
              {/* Order Summary and Status */}
              <div className='card-walmart p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Delivery in Progress
                  </h2>
                  <div className='badge-info'>Live Tracking</div>
                </div>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <svg
                        className='w-5 h-5 text-[#0071ce]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                        />
                      </svg>
                      <span className='font-semibold text-gray-900'>Item</span>
                    </div>
                    <p className='text-gray-700'>
                      {popularItems.find(i => i.id === item)?.name}
                    </p>
                  </div>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <svg
                        className='w-5 h-5 text-[#0071ce]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      <span className='font-semibold text-gray-900'>
                        Destination
                      </span>
                    </div>
                    <p className='text-gray-700 text-sm truncate'>
                      {currentDestination}
                    </p>
                  </div>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <svg
                        className='w-5 h-5 text-[#0071ce]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      <span className='font-semibold text-gray-900'>
                        Status
                      </span>
                    </div>
                    <p className='text-gray-700'>
                      {deliveryProgress === 100 ? 'Delivered' : 'In Transit'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className='card-walmart p-6'>
                <div className='map-container'>
                  <MapComponent
                    userAddress={address}
                    userCoords={coords}
                    selectedItem={item}
                    onProgressChange={setDeliveryProgress}
                    onDestinationChange={setCurrentDestination}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
